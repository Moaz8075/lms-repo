import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';
import { CaseStatus } from '../../../common/enums';

export class ListCasesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ description: 'Filter by client ID' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filter by court name (partial match)' })
  @IsOptional()
  @IsString()
  courtName?: string;

  @ApiPropertyOptional({
    description: 'Search case number, title, court, opponent, or client name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
