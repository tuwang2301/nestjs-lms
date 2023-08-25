import { Conduct, Gender, Rank } from '../../common/globalEnum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsEnum } from 'class-validator';

export class AddStudentDto {
  @ApiProperty()
  full_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsDateString()
  dob: Date;
  @ApiProperty({ name: 'gender', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;
  @ApiProperty({ name: 'rank', enum: Rank })
  @IsEnum(Rank)
  rank: Rank;
  @ApiProperty({ name: 'conduct', enum: Conduct })
  @IsEnum(Conduct)
  conduct: Conduct;
}
