import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  days?: number;
}

export class DiaryCalendarQueryDto {
  @ApiPropertyOptional({ example: '2026-07', description: 'Month as YYYY-MM' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be YYYY-MM' })
  month!: string;
}
