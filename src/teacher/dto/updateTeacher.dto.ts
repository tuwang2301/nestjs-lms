import {
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/users.entity';
import { Gender } from '../../common/globalEnum';
import { Course } from '../../course/course.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, MinLength } from "class-validator";
import { IsString } from '@nestjs/class-validator';

export class UpdateTeacherDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dob?: Date;
}
