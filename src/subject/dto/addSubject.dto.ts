import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class AddSubjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  credit: number;
}
