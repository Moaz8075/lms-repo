import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiUserRole } from '../../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Raza' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'ali.raza@legalease.pk' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @ApiProperty({ enum: ApiUserRole, example: ApiUserRole.ASSOCIATE })
  @IsEnum(ApiUserRole)
  role!: ApiUserRole;

  @ApiPropertyOptional({ example: '+923001234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}
