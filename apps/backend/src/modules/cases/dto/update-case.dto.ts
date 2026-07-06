import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CaseStatus, CaseType } from '../../../common/enums';

export class UpdateCaseDto {
  @ApiPropertyOptional({ example: 'Zahid vs. Metro Corp' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'CASE-2026-001' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  caseNumber?: string;

  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ example: 'Sindh High Court' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  courtName?: string;

  @ApiPropertyOptional({ enum: CaseType })
  @IsOptional()
  @IsEnum(CaseType)
  caseType?: CaseType;

  @ApiPropertyOptional({ example: 'Metro Corp Ltd.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  opponentParty?: string;

  @ApiPropertyOptional({ example: 'Adv. Bilal Ahmed' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  opponentLawyer?: string;

  @ApiPropertyOptional({ example: 'uuid-of-lawyer' })
  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  filingDate?: string;

  @ApiPropertyOptional({ example: 'Case description' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;
}
