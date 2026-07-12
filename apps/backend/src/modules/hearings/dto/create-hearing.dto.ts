import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateHearingDto {
  @ApiProperty({ example: 'uuid-of-case' })
  @IsUUID()
  caseId!: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  hearingDate!: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'time must be in HH:mm or HH:mm:ss format',
  })
  time!: string;

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

  @ApiPropertyOptional({ example: 'Client requested early arrival' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ example: '2026-08-01', description: 'Optional next hearing date' })
  @IsOptional()
  @IsDateString()
  nextHearingDate?: string;
}
