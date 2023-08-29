import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ApiPropertyOptional, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/custom.decorator";
import { MailerService } from "@nestjs-modules/mailer";

@Controller('mail')
@ApiTags('Mail')
export class MailController {
    constructor(private mailService: MailerService) {}

    // Here we use query parameter to get the email that we want to send
    @Get('plain-text-email')
    @Public()
    async plainTextEmail(@Query('toemail') toEmail: string) {
        var response = await this.mailService.sendMail({
            to:toEmail,
            from:"quangtu2301@gmail.com",
            subject: 'Plain Text Email ✔',
            text: 'Welcome NestJS Email Sending Tutorial',
        });
        return response;
    }
}