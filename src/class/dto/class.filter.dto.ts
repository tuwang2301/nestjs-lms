import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class ClassFilterDto{
    @ApiPropertyOptional()
    @IsOptional()
    name: string

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    student_number: number
}