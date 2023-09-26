import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationToken } from './entities/notification-token.entity';
import { Users } from 'src/users/users.entity';
import { NotificationController } from './notification.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationToken, Users]), EnrollmentModule, TeacherModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule { }
