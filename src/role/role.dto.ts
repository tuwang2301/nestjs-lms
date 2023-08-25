import { ApiProperty } from '@nestjs/swagger';

export class RoleDTO {
  @ApiProperty()
  authority: string;
}
