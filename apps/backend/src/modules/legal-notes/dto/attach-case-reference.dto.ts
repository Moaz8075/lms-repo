import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AttachCaseReferenceDto {
  @ApiProperty({ example: 'uuid-of-legal-note' })
  @IsUUID()
  legalNoteId!: string;
}
