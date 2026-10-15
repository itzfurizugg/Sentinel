import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity.js';
import {
  CreateStudentDto,
  QueryStudentDto,
  UpdateStudentDto,
} from './student.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const existing = await this.repo.findOne({ where: { nis: dto.nis } });
    if (existing) {
      throw new ConflictException(`NIS ${dto.nis} sudah terdaftar`);
    }
    const student = this.repo.create(dto);
    return this.repo.save(student);
  }

  async findAll(query: QueryStudentDto): Promise<{ data: Student[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));

    const qb = this.repo.createQueryBuilder('s');
    if (query.kelas) {
      qb.where('s.kelas = :kelas', { kelas: query.kelas });
    }
    qb.orderBy('s.kelas', 'ASC').addOrderBy('s.nama_lengkap', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(nis: string): Promise<Student> {
    const student = await this.repo.findOne({ where: { nis } });
    if (!student) {
      throw new NotFoundException(`Siswa dengan NIS ${nis} tidak ditemukan`);
    }
    return student;
  }

  async update(nis: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(nis);
    Object.assign(student, dto);
    return this.repo.save(student);
  }

  async remove(nis: string): Promise<void> {
    const student = await this.findOne(nis);
    await this.repo.remove(student);
  }
}
