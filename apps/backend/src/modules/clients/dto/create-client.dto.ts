import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { emptyToUndefined } from '../../../common/utils/dto.util';

const CNIC_PATTERN = /^(\d{5}-\d{7}-\d|\d{13})$/;

export class CreateClientDto {
  @ApiProperty({ example: 'Zahid Hassan' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'Muhammad Hassan' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fatherName?: string;

  @ApiPropertyOptional({ example: '42101-1234567-1' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Matches(CNIC_PATTERN, {
    message: 'CNIC must be in format 42101-1234567-1 or 13 digits',
  })
  cnic?: string;

  @ApiProperty({ example: '+923211234567' })
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({ example: '+923211234567' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'House 12, Block B, Gulshan-e-Iqbal, Karachi' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  address?: string;

  @ApiPropertyOptional({ example: 'Referred by existing client' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
