import {
    Column,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/users.entity';
import { Gender, Timeframe, Weekday } from '../../common/globalEnum';
import { Course } from '../../course/course.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, MinLength } from "class-validator";
import { IsNumber, IsString } from '@nestjs/class-validator';

export class scheduleCourseDTO {
    @ApiProperty()
    course_id: number;
    @ApiProperty({ enum: Weekday })
    @IsEnum(Weekday)
    weekday: Weekday;
    @ApiProperty({ enum: Timeframe })
    @IsEnum(Timeframe)
    timeframe: Timeframe;
}
