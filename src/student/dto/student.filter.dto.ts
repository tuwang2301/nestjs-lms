import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { Conduct, Gender, Rank } from "../../common/globalEnum";

export class StudentFilterDto{
    @ApiPropertyOptional()
    @IsOptional()
    full_name?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dob?: Date;

    @ApiPropertyOptional({ name: 'gender', enum: Gender })
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @ApiPropertyOptional({ name: 'rank', enum: Rank })
    @IsEnum(Rank)
    @IsOptional()
    rank?: Rank;

    @ApiPropertyOptional({ name: 'conduct', enum: Conduct })
    @IsEnum(Conduct)
    @IsOptional()
    conduct?: Conduct;
}