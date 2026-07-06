import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPaymentMethod, ApiPaymentStatus } from '../../../common/enums';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: 75000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ enum: ApiPaymentMethod })
  @IsOptional()
  @IsEnum(ApiPaymentMethod)
  paymentMethod?: ApiPaymentMethod;

  @ApiPropertyOptional({ enum: ApiPaymentStatus })
  @IsOptional()
  @IsEnum(ApiPaymentStatus)
  status?: ApiPaymentStatus;

  @ApiPropertyOptional({ example: 'Updated payment notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
