import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class DiaryQueryDto {
  @ApiPropertyOptional({ example: '2026-06-18' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ description: 'Filter agenda items for a specific case' })
  @IsOptional()
  @IsUUID()
  caseId?: string;
}

export class UpcomingDiaryQueryDto {
  @ApiPropertyOptional({ description: 'Filter upcoming items for a specific case' })
  @IsOptional()
  @IsUUID()
  caseId?: string;

  @ApiPropertyOptional({ description: 'Number of days ahead to include', default: 30 })
  @IsOptional()
  days?: number;
}
