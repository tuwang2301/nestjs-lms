import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
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
}