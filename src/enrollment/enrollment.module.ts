import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { Student } from '../student/student.entity';
import { Course } from '../course/course.entity';
import { UsersService } from "../users/users.service";
import { Users } from "../users/users.entity";
import { Role } from "../role/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course, Users, Role])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, UsersService],
})
export class EnrollmentModule {}
