import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity.js';
import { QueryAttendanceDto, ScanDto } from './attendance.dto.js';
import { StudentsService } from '../students/students.service.js';

const JAKARTA_OFFSET = 7 * 60;

function nowJakarta(): Date {
  return new Date();
}

function todayJakarta(): string {
  const now = new Date();
  const jakartaMs = now.getTime() + JAKARTA_OFFSET * 60 * 1000;
  const d = new Date(jakartaMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
    private readonly studentsService: StudentsService,
  ) {}

  async scan(dto: ScanDto): Promise<{
    status: 'masuk' | 'pulang' | 'lengkap';
    nama: string;
    nis: string;
    kelas: string;
    waktu: string | null;
  }> {
    const student = await this.studentsService.findOne(dto.nis);
    const tanggal = todayJakarta();

    let record = await this.repo.findOne({
      where: { nis: dto.nis, tanggal },
    });

    if (!record) {
      const now = nowJakarta();
      record = this.repo.create({
        nis: dto.nis,
        tanggal,
        jam_masuk: now,
        jam_pulang: null,
      });
      await this.repo.save(record);
      return {
        status: 'masuk',
        nama: student.nama_lengkap,
        nis: student.nis,
        kelas: student.kelas,
        waktu: record.jam_masuk!.toISOString(),
      };
    }

    if (record.jam_masuk && !record.jam_pulang) {
      record.jam_pulang = nowJakarta();
      await this.repo.save(record);
      return {
        status: 'pulang',
        nama: student.nama_lengkap,
        nis: student.nis,
        kelas: student.kelas,
        waktu: record.jam_pulang.toISOString(),
      };
    }

    return {
      status: 'lengkap',
      nama: student.nama_lengkap,
      nis: student.nis,
      kelas: student.kelas,
      waktu: null,
    };
  }

  async findAll(query: QueryAttendanceDto): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));

    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.student', 'student');

    if (query.nis) {
      qb.andWhere('a.nis = :nis', { nis: query.nis });
    }
    if (query.kelas) {
      qb.andWhere('student.kelas = :kelas', { kelas: query.kelas });
    }
    if (query.tanggal) {
      qb.andWhere('a.tanggal = :tanggal', { tanggal: query.tanggal });
    } else {
      if (query.from) {
        qb.andWhere('a.tanggal >= :from', { from: query.from });
      }
      if (query.to) {
        qb.andWhere('a.tanggal <= :to', { to: query.to });
      }
    }

    qb.orderBy('a.tanggal', 'DESC')
      .addOrderBy('student.kelas', 'ASC')
      .addOrderBy('student.nama_lengkap', 'ASC');

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findByStudent(nis: string, query: QueryAttendanceDto): Promise<{
    student: { nis: string; nama_lengkap: string; kelas: string };
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const student = await this.studentsService.findOne(nis);
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));

    const qb = this.repo
      .createQueryBuilder('a')
      .where('a.nis = :nis', { nis });

    if (query.from) {
      qb.andWhere('a.tanggal >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('a.tanggal <= :to', { to: query.to });
    }

    qb.orderBy('a.tanggal', 'DESC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      student: {
        nis: student.nis,
        nama_lengkap: student.nama_lengkap,
        kelas: student.kelas,
      },
      data,
      total,
      page,
      limit,
    };
  }
}
