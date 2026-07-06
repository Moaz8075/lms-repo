import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLegalNoteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  personalNote?: string;

  @ApiPropertyOptional({ example: ['bail', 'constitutional'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
