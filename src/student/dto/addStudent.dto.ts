import { Conduct, Gender, Rank } from '../../common/globalEnum';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { IsString } from "@nestjs/class-validator";

export class AddStudentDto {
  @ApiProperty()
  full_name: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;
  @ApiProperty({ name: 'gender', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string = 'https://firebasestorage.googleapis.com/v0/b/uploadingfile-59a57.appspot.com/o/images%2Fdefault_ava.jpg?alt=media&token=e52dd8c4-965a-4177-bbe5-9e3ce5257d61';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ name: 'rank', enum: Rank })
  @IsEnum(Rank)
  rank: Rank;
  @ApiProperty({ name: 'conduct', enum: Conduct })
  @IsEnum(Conduct)
  conduct: Conduct;
}
