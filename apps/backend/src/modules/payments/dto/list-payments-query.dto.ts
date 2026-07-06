import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListPaymentsQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Filter payments by case ID' })
  @IsUUID()
  caseId!: string;
}
