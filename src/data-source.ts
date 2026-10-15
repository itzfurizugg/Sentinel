import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Student } from './students/student.entity.js';
import { Attendance } from './attendance/attendance.entity.js';
import { User } from './users/user.entity.js';
import { InitSchema1728950000000 } from './database/migrations/1728950000000-InitSchema.js';
import { CreateUsersTable1728960000000 } from './database/migrations/1728960000000-CreateUsersTable.js';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5433', 10),
  username: process.env.DB_USERNAME ?? 'sentinel',
  password: process.env.DB_PASSWORD ?? 'sentinel123',
  database: process.env.DB_DATABASE ?? 'sentinel',
  entities: [Student, Attendance, User],
  migrations: [InitSchema1728950000000, CreateUsersTable1728960000000],
  synchronize: false,
});
