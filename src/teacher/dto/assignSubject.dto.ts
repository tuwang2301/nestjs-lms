import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignSubjectDto {
  @ApiProperty()
  @IsNumber()
  teacher_id: number;
  @ApiProperty()
  @IsNumber()
  subject_id: number;
}
