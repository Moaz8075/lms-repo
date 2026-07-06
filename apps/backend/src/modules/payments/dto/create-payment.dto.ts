import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPaymentMethod, ApiPaymentStatus } from '../../../common/enums';

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-of-case' })
  @IsUUID()
  caseId!: string;

  @ApiProperty({ example: 50000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: ApiPaymentMethod, example: ApiPaymentMethod.CASH })
  @IsEnum(ApiPaymentMethod)
  paymentMethod!: ApiPaymentMethod;

  @ApiProperty({ enum: ApiPaymentStatus, example: ApiPaymentStatus.PAID })
  @IsEnum(ApiPaymentStatus)
  status!: ApiPaymentStatus;

  @ApiPropertyOptional({ example: 'Initial retainer payment' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
