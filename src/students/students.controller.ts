import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service.js';
import {
  CreateStudentDto,
  QueryStudentDto,
  UpdateStudentDto,
} from './student.dto.js';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Tambah siswa baru' })
  create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Daftar siswa (filter kelas, pagination)' })
  findAll(@Query() query: QueryStudentDto) {
    return this.service.findAll(query);
  }

  @Get(':nis')
  @ApiOperation({ summary: 'Detail siswa by NIS' })
  findOne(@Param('nis') nis: string) {
    return this.service.findOne(nis);
  }

  @Patch(':nis')
  @ApiOperation({ summary: 'Update data siswa' })
  update(@Param('nis') nis: string, @Body() dto: UpdateStudentDto) {
    return this.service.update(nis, dto);
  }

  @Delete(':nis')
  @HttpCode(204)
  @ApiOperation({ summary: 'Hapus siswa' })
  remove(@Param('nis') nis: string) {
    return this.service.remove(nis);
  }
}
