import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListDocumentsQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Filter documents by case ID' })
  @IsUUID()
  caseId!: string;
}
