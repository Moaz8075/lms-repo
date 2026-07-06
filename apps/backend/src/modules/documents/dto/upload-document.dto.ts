import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentFileType } from '../../../common/enums';

export class UploadDocumentDto {
  @ApiProperty({ example: 'uuid-of-case' })
  @IsUUID()
  caseId!: string;

  @ApiProperty({ example: 'petition-draft.pdf' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fileName!: string;

  @ApiProperty({ example: 'https://cdn.example.com/files/petition-draft.pdf' })
  @IsUrl()
  @MaxLength(500)
  fileUrl!: string;

  @ApiProperty({ enum: DocumentFileType, example: DocumentFileType.PDF })
  @IsEnum(DocumentFileType)
  fileType!: DocumentFileType;

  @ApiPropertyOptional({ example: 'Petition' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
