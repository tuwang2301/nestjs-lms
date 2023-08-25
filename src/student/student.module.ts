import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Enrollment } from "../enrollment/enrollment.entity";
import { Course } from "../course/course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Student, Enrollment, Course])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
