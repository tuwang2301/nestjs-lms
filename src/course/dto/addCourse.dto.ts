import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class AddCourseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  subject_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  teacher_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  class_room_id: number;

  @ApiProperty()
  @IsDateString()
  start_at: Date;

  @ApiProperty()
  @IsDateString()
  end_at: Date;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
}
