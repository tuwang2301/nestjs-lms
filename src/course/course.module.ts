import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Subject } from '../subject/subject.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Class } from "../class/class.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Course, Subject, Teacher, Class])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
