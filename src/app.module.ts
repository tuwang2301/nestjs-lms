import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./users/users.entity";
import { Teacher } from "./teacher/teacher.entity";
import { Subject } from "./subject/subject.entity";
import { Role } from "./role/role.entity";
import { Course } from "./course/course.entity";
import { Class } from "./class/class.entity";
import { UsersModule } from "./users/users.module";
import { Enrollment } from "./enrollment/enrollment.entity";
import { StudentModule } from "./student/student.module";
import { Student } from "./student/student.entity";
import { ClassModule } from "./class/class.module";
import { CourseModule } from "./course/course.module";
import { EnrollmentModule } from "./enrollment/enrollment.module";
import { RoleModule } from "./role/role.module";
import { SubjectModule } from "./subject/subject.module";
import { TeacherModule } from "./teacher/teacher.module";
import { AuthModule } from "./auth/auth.module";
import { EmailVerification } from "./auth/emailVerification.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailController } from "./mail/mail.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { TimetableModule } from "./timetable/timetable.module";
import { Timetable } from "./timetable/timetable.entity";
import { NotificationModule } from './notification/notification.module';
import { Notification } from "./notification/entities/notification.entity";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.sendgrid.net',
                auth: {
                    user: 'apikey',
                    pass: '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',
                },
            }
        }),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "123456",
            database: "school_test",
            logging: ["error", 'query'],
            entities: [
                Users,
                Teacher,
                Subject,
                Student,
                Role,
                Course,
                Class,
                Enrollment,
                EmailVerification,
                Timetable,
                Notification
            ],
            synchronize: true,
            autoLoadEntities: true
        }),
        AuthModule,
        CourseModule,
        TimetableModule,
        EnrollmentModule,
        StudentModule,
        TeacherModule,
        SubjectModule,
        ClassModule,
        UsersModule,
        RoleModule,
        NotificationModule,
    ],
    controllers: [AppController, MailController],
    providers: [AppService]
})
export class AppModule {
}
