import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Student } from '../students/student.entity.js';

@Entity('attendances')
@Unique(['nis', 'tanggal'])
@Index(['nis', 'tanggal'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  nis: string;

  @ManyToOne(() => Student, (student) => student.attendances, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'nis' })
  student: Student;

  @Column({ type: 'date' })
  tanggal: string;

  @Column({ type: 'timestamptz', nullable: true })
  jam_masuk: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  jam_pulang: Date | null;
}
