import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class UpdateSubjectDto {
  @ApiProperty()
  @IsString()
  @Optional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @Optional()
  credit: number;
}
