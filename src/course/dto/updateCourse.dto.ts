import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  subject_id?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  teacher_id?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  start_at?: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  end_at?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  class_room_id?: number;
}
