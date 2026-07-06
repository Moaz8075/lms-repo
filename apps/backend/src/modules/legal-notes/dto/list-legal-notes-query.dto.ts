import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class ListLegalNotesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Full-text search on title, selected text, personal note' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  court?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  citation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  libraryItemId?: string;
}
