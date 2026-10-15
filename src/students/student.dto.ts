import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: '2324001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nis: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nama_lengkap: string;

  @ApiProperty({ example: 'XII IPA 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  kelas: string;
}

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nama_lengkap?: string;

  @ApiPropertyOptional({ example: 'XII IPA 2' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  kelas?: string;
}

export class QueryStudentDto {
  @ApiPropertyOptional({ example: 'XII IPA 1' })
  @IsString()
  @IsOptional()
  kelas?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  limit?: number;
}
