import { ApiProperty } from '@nestjs/swagger';
import { IsString } from '@nestjs/class-validator';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/globalEnum';

export class SignupDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDateString()
  dob: Date;
}
