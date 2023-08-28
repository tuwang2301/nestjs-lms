import { Conduct, Gender, Rank } from '../../common/globalEnum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsEnum } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateStudentDto {
  @ApiProperty()
  @Optional()
  full_name?: string;

  @ApiProperty()
  @IsDateString()
  @Optional()
  dob?: Date;

  @ApiProperty({ name: 'gender', enum: Gender })
  @IsEnum(Gender)
  @Optional()
  gender?: Gender;

  @ApiProperty({ name: 'rank', enum: Rank })
  @IsEnum(Rank)
  @Optional()
  rank?: Rank;

  @ApiProperty({ name: 'conduct', enum: Conduct })
  @IsEnum(Conduct)
  @Optional()
  conduct?: Conduct;
}
