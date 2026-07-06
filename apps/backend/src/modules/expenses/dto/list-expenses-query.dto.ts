import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListExpensesQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Filter expenses by case ID' })
  @IsUUID()
  caseId!: string;
}
