import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignTeacherDTO {
  @ApiProperty()
  @IsNumber()
  course_id: number;
  @ApiProperty()
  @IsNumber()
  teacher_id: number;
}
