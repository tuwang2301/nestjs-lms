import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class UpdateSubjectDto {
  @ApiPropertyOptional()
  @IsString()
  @Optional()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Optional()
  credit?: number;
}
