import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ScanDto {
  @ApiProperty({ example: '2324001' })
  @IsString()
  @IsNotEmpty()
  nis: string;
}

export class QueryAttendanceDto {
  @ApiPropertyOptional({ example: '2324001' })
  @IsString()
  @IsOptional()
  nis?: string;

  @ApiPropertyOptional({ example: 'XII IPA 1' })
  @IsString()
  @IsOptional()
  kelas?: string;

  @ApiPropertyOptional({ example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  tanggal?: string;

  @ApiPropertyOptional({ example: '2026-10-01' })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2026-10-31' })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  limit?: number;
}
