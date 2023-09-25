import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDTO {
  @ApiProperty({ default: 'hieutruong' })
  @IsString()
  username: string;
  @ApiProperty({ default: 'Ilove@2003' })
  @IsString()
  password: string;
  @ApiProperty()
  client_token: string;
}
