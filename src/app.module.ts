import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { Student } from './students/student.entity.js';
import { Attendance } from './attendance/attendance.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5433),
        username: config.get<string>('DB_USERNAME', 'sentinel'),
        password: config.get<string>('DB_PASSWORD', 'sentinel123'),
        database: config.get<string>('DB_DATABASE', 'sentinel'),
        entities: [Student, Attendance],
        migrations: ['dist/database/migrations/*.js'],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    StudentsModule,
    AttendanceModule,
  ],
})
export class AppModule {}
