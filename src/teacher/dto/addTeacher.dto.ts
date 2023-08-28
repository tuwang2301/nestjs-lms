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

export class addTeacherDto {
  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsDateString()
  dob: Date;
}
