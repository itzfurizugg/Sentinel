import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Student } from './students/student.entity.js';
import { Attendance } from './attendance/attendance.entity.js';
import { InitSchema1728950000000 } from './database/migrations/1728950000000-InitSchema.js';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5433', 10),
  username: process.env.DB_USERNAME ?? 'sentinel',
  password: process.env.DB_PASSWORD ?? 'sentinel123',
  database: process.env.DB_DATABASE ?? 'sentinel',
  entities: [Student, Attendance],
  migrations: [InitSchema1728950000000],
  synchronize: false,
});
