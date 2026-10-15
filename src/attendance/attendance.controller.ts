import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { QueryAttendanceDto, ScanDto } from './attendance.dto.js';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Scan kartu siswa (masuk / pulang)' })
  scan(@Body() dto: ScanDto) {
    return this.service.scan(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Rekap absensi (filter nis, kelas, tanggal, from, to)' })
  findAll(@Query() query: QueryAttendanceDto) {
    return this.service.findAll(query);
  }

  @Get('student/:nis')
  @ApiOperation({ summary: 'Rekap absensi per siswa' })
  findByStudent(
    @Param('nis') nis: string,
    @Query() query: QueryAttendanceDto,
  ) {
    return this.service.findByStudent(nis, query);
  }
}
