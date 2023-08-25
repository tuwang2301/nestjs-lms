import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdateEnrollmentDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  student_id?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  course_id?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  enroll_date?: Date;
}
