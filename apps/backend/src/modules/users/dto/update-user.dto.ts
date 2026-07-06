import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiUserRole } from '../../../common/enums';

export class UpdateUserDto {
  @ApiProperty({ enum: ApiUserRole, example: ApiUserRole.ASSOCIATE })
  @IsEnum(ApiUserRole)
  role!: ApiUserRole;
}
