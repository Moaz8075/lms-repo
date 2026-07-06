import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLibraryItemDto {
  @ApiProperty({ example: 'Muhammad Aslam v. State' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({ example: 'https://storage.example.com/judgment.pdf' })
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  pdfUrl!: string;

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

  @ApiPropertyOptional({ example: 'Pakistan' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  jurisdiction?: string;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  year?: number;

  @ApiPropertyOptional({ example: 'Judgment' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'Justice XYZ' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  author?: string;

  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalPages?: number;

  @ApiPropertyOptional({ example: 'Landmark constitutional case' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: ['constitutional', 'criminal'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
