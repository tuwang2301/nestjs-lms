import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./users/users.entity";
import { Role } from "./role/role.entity";
import { UsersModule } from "./users/users.module";
import { RoleModule } from "./role/role.module";
import { AuthModule } from "./auth/auth.module";
import { EmailVerification } from "./auth/emailVerification.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailController } from "./mail/mail.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
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
            url: 'postgres://sammy:password@localhost:35000/db',
            synchronize: true,
            autoLoadEntities: true
        }),
        AuthModule,
        UsersModule,
        RoleModule,
        NotificationModule,
    ],
    controllers: [AppController, MailController],
    providers: [AppService]
})
export class AppModule {
}
