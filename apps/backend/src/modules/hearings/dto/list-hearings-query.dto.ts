import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListHearingsQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Filter hearings by case ID' })
  @IsUUID()
  caseId!: string;
}
