import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CaseType } from '../../../common/enums';
import { emptyToUndefined } from '../../../common/utils/dto.util';

export class CreateCaseDto {
  @ApiPropertyOptional({
    example: 'Zahid Hassan vs Metro Corp',
    description: 'Auto-generated from client vs opponent when omitted',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'CASE-2026-001',
    description: 'Auto-generated as CASE-YYYY-NNN when omitted',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  caseNumber?: string;

  @ApiProperty({ example: 'uuid-of-client' })
  @IsUUID()
  clientId!: string;

  @ApiPropertyOptional({ example: 'Sindh High Court' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  courtName?: string;

  @ApiPropertyOptional({ enum: CaseType, example: CaseType.CIVIL })
  @IsOptional()
  @IsEnum(CaseType)
  caseType?: CaseType;

  @ApiProperty({ example: 'Metro Corp Ltd.' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  opponentParty!: string;

  @ApiPropertyOptional({ example: 'Adv. Bilal Ahmed' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  opponentLawyer?: string;

  @ApiPropertyOptional({ example: 'uuid-of-lawyer' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsUUID()
  assignedLawyerId?: string;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsDateString()
  filingDate?: string;
}
