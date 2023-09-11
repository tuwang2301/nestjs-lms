import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber, IsOptional } from "class-validator";
import { Column } from "typeorm";

export class CourseFilterDto{
    @ApiPropertyOptional()
    @IsOptional()
    name?: string

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    start_at?: Date;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    end_at?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    teachers_id?: number[]

    @ApiPropertyOptional()
    @IsOptional()
    subjects_id?: number[]
}