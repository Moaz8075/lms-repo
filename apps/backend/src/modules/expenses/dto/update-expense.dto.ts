import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiExpenseCategory } from '../../../common/enums';

export class UpdateExpenseDto {
  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ enum: ApiExpenseCategory })
  @IsOptional()
  @IsEnum(ApiExpenseCategory)
  category?: ApiExpenseCategory;

  @ApiPropertyOptional({ example: '2026-06-18' })
  @IsOptional()
  @IsDateString()
  expenseDate?: string;

  @ApiPropertyOptional({ example: 'Updated expense description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
