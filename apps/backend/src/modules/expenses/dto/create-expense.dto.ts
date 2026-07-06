import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiExpenseCategory } from '../../../common/enums';

export class CreateExpenseDto {
  @ApiProperty({ example: 'uuid-of-case' })
  @IsUUID()
  caseId!: string;

  @ApiProperty({ example: 2500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: ApiExpenseCategory, example: ApiExpenseCategory.COURT_FEES })
  @IsEnum(ApiExpenseCategory)
  category!: ApiExpenseCategory;

  @ApiProperty({ example: '2026-06-18' })
  @IsDateString()
  expenseDate!: string;

  @ApiPropertyOptional({ example: 'Court fee for filing petition' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
