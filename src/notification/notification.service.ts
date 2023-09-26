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
    private usersRepo: Repository<Users>
  ) { }

  @Cron('45 * * * * *')
  handleCron() {
    this.sendPush(12, 'Hello', 'Test');
    console.log('Hello');

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
        await this.notificationsRepo.save({
          notification_token: notification,
          title,
          body,
          status: 'ACTIVE',
          created_by: 'TuWang',
        });
        return await firebase
          .messaging()
          .send({
            notification: { title, body },
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