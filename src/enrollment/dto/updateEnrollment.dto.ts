import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdateEnrollmentDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  student_id?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  course_id?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  enroll_date?: Date;
}
