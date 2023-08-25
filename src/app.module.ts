import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { Teacher } from './teacher/teacher.entity';
import { Subject } from './subject/subject.entity';
import { Role } from './role/role.entity';
import { Course } from './course/course.entity';
import { Class } from './class/class.entity';
import { UsersModule } from './users/users.module';
import { Enrollment } from './enrollment/enrollment.entity';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';
import { ClassModule } from './class/class.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { RoleModule } from './role/role.module';
import { SubjectModule } from './subject/subject.module';
import { TeacherModule } from './teacher/teacher.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'school_test',
      logging: ['query', 'error'],
      entities: [
        Users,
        Teacher,
        Subject,
        Student,
        Role,
        Course,
        Class,
        Enrollment,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    StudentModule,
    ClassModule,
    CourseModule,
    EnrollmentModule,
    RoleModule,
    SubjectModule,
    TeacherModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
