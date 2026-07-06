import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLegalNoteDto {
  @ApiProperty({ example: 'Right to fair trial — key paragraph' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber!: number;

  @ApiProperty({ example: 'Every citizen shall have the right to a fair trial...' })
  @IsString()
  @MinLength(1)
  selectedText!: string;

  @ApiPropertyOptional({ example: 'Useful for bail applications' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  personalNote?: string;

  @ApiPropertyOptional({ example: 'uuid-of-library-item' })
  @IsOptional()
  @IsUUID()
  libraryItemId?: string;

  @ApiPropertyOptional({ example: 'PLD 2020 SC 123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  citation?: string;

  @ApiPropertyOptional({ example: 'Supreme Court of Pakistan' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  court?: string;

  @ApiPropertyOptional({ example: ['bail', 'constitutional'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
