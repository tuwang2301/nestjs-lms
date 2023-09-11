import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { IsNumber, IsOptional } from "class-validator";

export class UpdateSubjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  credit?: number;
}
