import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;
  @ApiProperty()
  @IsNumber()
  role_id: number;
}
