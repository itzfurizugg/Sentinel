import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from '../attendance/attendance.entity.js';

@Entity('students')
export class Student {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  nis: string;

  @Column({ type: 'varchar', length: 100 })
  nama_lengkap: string;

  @Column({ type: 'varchar', length: 20 })
  kelas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}
