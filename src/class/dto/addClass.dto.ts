import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { IsNumber, IsOptional } from 'class-validator';

export class AddClassDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  student_number: number;
}
