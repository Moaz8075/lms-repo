import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { HearingOutcome } from '@prisma/client';

export class UpdateHearingDto {
  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsOptional()
  @IsDateString()
  hearingDate?: string;

  @ApiPropertyOptional({ example: '10:30' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'time must be in HH:mm or HH:mm:ss format',
  })
  time?: string;

  @ApiPropertyOptional({ example: 'Court Room 3A' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  courtRoom?: string;

  @ApiPropertyOptional({ example: 'Arguments on interim injunction' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  purpose?: string;

  @ApiPropertyOptional({ example: 'Adjourned to next month' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ enum: HearingOutcome })
  @IsOptional()
  @IsEnum(HearingOutcome)
  outcome?: HearingOutcome;

  @ApiPropertyOptional({ example: '2026-08-15' })
  @IsOptional()
  @IsDateString()
  nextHearingDate?: string;
}
