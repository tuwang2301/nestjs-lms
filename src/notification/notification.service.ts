import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationToken } from './entities/notification-token.entity';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { Users } from 'src/users/users.entity';
import { Cron } from '@nestjs/schedule';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { TeacherService } from 'src/teacher/teacher.service';
import dayjs = require('dayjs');

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'src\\firebase-service-account-key.json'),
  ),
});
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private enrollService: EnrollmentService,
    private teacherService: TeacherService,
  ) { }

  @Cron('0 5 * * * *')
  async handleCron() {
    const activeList = await this.notificationTokenRepo.find({
      relations: {
        user: {
          student: true,
          teacher: true
        }
      },
      where: { status: 'ACTIVE' }
    })
    const today = dayjs().format('dddd').toLowerCase();
    const nextTimeFrame = dayjs().hour() + 1;
    if ([8, 14, 16, 18].includes(nextTimeFrame)) {
      // Create a Day.js object for 11:00 AM today
      const targetTime = dayjs().set('hour', nextTimeFrame).set('minute', 0).set('second', 0);

      // Get the current time
      const currentTime = dayjs();

      // Calculate the time left
      const timeLeft = targetTime.diff(currentTime, 'minute');

      if (timeLeft < 15) {
        activeList.forEach(async (token) => {
          let courses = [];
          if (token.user.student) {
            courses = (await this.enrollService.getCoursesOfStudent(token.user.student.id)).map(enroll => enroll.course);
          } else if (token.user.teacher) {
            courses = await this.teacherService.getAllCoursesOfTeacher(token.user.teacher.id)
          }
          const todayCourse = courses.find(course => course.timetables.find(time => (time.weekday === today && time.timeframe.startsWith(nextTimeFrame.toString()))))
          if (todayCourse) (
            await this.sendPush(token.user.id, `${todayCourse.name} IS COMING AFTER ${timeLeft} MINUTES`, `Please attend ${todayCourse.name} on time`)
          )
        })
      }
    }

  }


  acceptPushNotification = async (
    user_id: number,
    notification_token_string: string,
  ): Promise<NotificationToken> => {
    try {
      const user = await this.usersRepo.findOne({ where: { id: user_id } });
      if (!user) {
        throw new Error('User not found')
      }
      const notification = await this.notificationTokenRepo.findOne({ where: { user: { id: user_id } } });
      let notification_token = null;
      if (notification) {
        notification.notification_token = notification_token_string;
        notification.status = 'ACTIVE'
        notification_token = await this.notificationTokenRepo.save(notification);
      } else {
        notification_token = await this.notificationTokenRepo.save({
          user: user,
          notification_token: notification_token_string,
          status: 'ACTIVE',
        });
      }
      return notification_token;
    } catch (e) {
      throw e;
    }
  };

  disablePushNotification = async (
    user: any,
    update_dto: UpdateNotificationDto,
  ): Promise<void> => {
    try {
      await this.notificationTokenRepo.update(
        { user: { id: user.id } },
        {
          status: 'INACTIVE',
        },
      );
    } catch (error) {
      return error;
    }
  };

  getNotifications = async (): Promise<any> => {
    return await this.notificationsRepo.find();
  };

  async sendPush(user_id: number, title: string, body: string) {
    try {
      const notification = await this.notificationTokenRepo.findOne({
        where: { user: { id: user_id }, status: 'ACTIVE' },
      });
      console.log(notification);

      if (notification) {
        return await firebase
          .messaging()
          .send({
            notification: { title, body, imageUrl: 'https://img.freepik.com/premium-vector/flat-web-template-with-lms-concept-design-concept-learning-management-system_100456-8728.jpg' },
            token: notification.notification_token,
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      return error;
    }
  };
}