import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';
import { CaseStatus, CaseType } from '../../../common/enums';

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

export class ListCasesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ enum: CaseType })
  @IsOptional()
  @IsEnum(CaseType)
  caseType?: CaseType;

  @ApiPropertyOptional({ description: 'Filter by client ID' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned lawyer ID' })
  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;

  @ApiPropertyOptional({ description: 'Filter by court name (partial match)' })
  @IsOptional()
  @IsString()
  courtName?: string;

  @ApiPropertyOptional({
    description: 'Search case number, title, court, opponent, or client name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Only cases with a hearing scheduled today' })
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsOptional()
  @IsBoolean()
  hearingToday?: boolean;

  @ApiPropertyOptional({ description: 'Only open / in-progress cases' })
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsOptional()
  @IsBoolean()
  ongoing?: boolean;

  @ApiPropertyOptional({ description: 'Filed on or after (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  filedFrom?: string;

  @ApiPropertyOptional({ description: 'Filed on or before (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  filedTo?: string;
}
