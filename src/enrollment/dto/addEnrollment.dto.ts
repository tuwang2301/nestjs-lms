import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class AddEnrollmentDTO {
  @ApiProperty()
  @IsNumber()
  student_id: number;

  @ApiProperty()
  @IsNumber()
  course_id: number;

  @ApiProperty()
  @IsDateString()
  enroll_date: Date;
}
