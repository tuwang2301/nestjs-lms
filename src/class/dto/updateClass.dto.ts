import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateClassDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  student_number?: number;
}
