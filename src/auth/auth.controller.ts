import {
    Body,
    Controller,
    Delete,
    Get, Param,
    Post, Put,
    Request,
    Headers
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersDTO } from "../users/dto/users.dto";
import { ResponseObject } from "../common/ResponseObject";
import { Public } from "../common/custom.decorator";
import { SignupDto } from "./dto/signup.dto";
import { UsersService } from "../users/users.service";
import { VerifyEmailDto } from "./dto/verifyEmail.dto";
import * as dayjs from "dayjs";
import { NotificationService } from "src/notification/notification.service";
import { Authorities } from "./authorities.decorator";
import { Authority } from "src/common/globalEnum";

@Controller("auth")
@ApiTags("Authentication")
@ApiBearerAuth()
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private notificationService: NotificationService
    ) {
    }

    @Post("login")
    @ApiOperation({ summary: "Sign in" })
    @Public()
    async signIn(@Body() signInDto: UsersDTO) {
        try {
            const result = await this.authService.signIn(
                signInDto.username,
                signInDto.password,
            );
            await this.notificationService.acceptPushNotification(result.user.id, signInDto.client_token)
            return new ResponseObject(true, "Sign in successfully", result);
        } catch (e) {
            return new ResponseObject(false, "Sign in fail", e.message);
        }
    }

    @Post("signup/student")
    @ApiOperation({ summary: "Sign up new student" })
    @Public()
    async signUpStudent(@Body() signUpDto: SignupDto) {
        try {
            const newStudent = await this.authService.signUpStudent(signUpDto);
            await this.authService.createEmailToken(newStudent.email);
            //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
            var sent = await this.authService.sendEmailVerification(newStudent.email);
            if (sent) {
                return new ResponseObject(true, "Register successfully! Check your mail", newStudent);
            } else {
                return new ResponseObject(false, "Error: Email not sent", newStudent);
            }
        } catch (e) {
            return new ResponseObject(false, "Sign up fail", e.message);
        }
    }

    @Post("signup/teacher")
    @ApiOperation({ summary: "Sign up new teacher" })
    @Public()
    async signUpTeacher(@Body() signUpDto: SignupDto) {
        try {
            const result = await this.authService.signUpTeacher(signUpDto);
            return new ResponseObject(true, "Sign up successfully", result);
        } catch (e) {
            return new ResponseObject(false, "Sign up fail", e.message);
        }
    }

    @Put("verify")
    @Public()
    public async verifyEmail(@Body() data: VerifyEmailDto) {
        try {
            const isEmailVerified = await this.authService.verifyEmail(data.email, data.token);
            return new ResponseObject(true, "LOGIN.EMAIL_VERIFIED", isEmailVerified);
        } catch (error) {
            return new ResponseObject(false, "LOGIN.ERROR", error.message);
        }
    }


    @Get("resend-verification/:email")
    @Public()
    public async sendEmailVerification(@Param("email") email: string) {
        try {
            let start = dayjs();
            if (!(await this.authService.findByEmail(email))) {
                return new ResponseObject(false, "User not found!", false);
            }
            await this.authService.createEmailToken(email);
            var isEmailSent = await this.authService.sendEmailVerification(email);
            if (isEmailSent) {
                console.log("Total time taken : " + dayjs().diff(start, 'milliseconds', true) + " milliseconds");
                return new ResponseObject(true, "Email token resent!", isEmailSent);
            } else {
                return new ResponseObject(false, "Email token not resent!", isEmailSent);
            }
        } catch (error) {
            return new ResponseObject(false, "Email token resent error!", error.message);
        }
    }

    @Get("profile")
    getProfile(@Request() req) {
        return this.userService.getUserProfile(req.user.id);
    }

    @Put('logout')
    @ApiOperation({ summary: 'Log out' })
    @Authorities(Authority.Admin, Authority.Student, Authority.Student)
    public async logout(@Headers() headers) {
        const user = await this.userService.getUserByToken(headers.authorization);
        try {
            const isEmailVerified = await this.authService.logout(user.id);
            return new ResponseObject(true, "LOGIN.EMAIL_VERIFIED", isEmailVerified);
        } catch (error) {
            return new ResponseObject(false, "LOGIN.ERROR", error.message);
        }
    }
}
