import { Conduct, Gender, Rank } from '../../common/globalEnum';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { Optional } from '@nestjs/common';
import { IsString } from "@nestjs/class-validator";

export class UpdateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;


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
