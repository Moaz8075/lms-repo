import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListClientsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by client name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by CNIC (partial match)' })
  @IsOptional()
  @IsString()
  cnic?: string;
}
