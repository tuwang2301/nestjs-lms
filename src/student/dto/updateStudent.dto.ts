import { Conduct, Gender, Rank } from '../../common/globalEnum';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { Optional } from '@nestjs/common';

export class UpdateStudentDto {
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
