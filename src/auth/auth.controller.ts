import {
  Body,
  Controller,
  Get, Param,
  Post, Put,
  Request
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersDTO } from '../users/dto/users.dto';
import { ResponseObject } from '../common/ResponseObject';
import { Public } from '../common/custom.decorator';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from "../users/users.service";
import { VerifyEmailDto } from "./dto/verifyEmail.dto";

@Controller('auth')
@ApiTags('Authentication')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @Public()
  async signIn(@Body() signInDto: UsersDTO) {
    try {
      const result = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );
      return new ResponseObject(true, 'Sign in successfully', result);
    } catch (e) {
      return new ResponseObject(false, 'Sign in fail', e.message);
    }
  }

  @Post('signup/student')
  @ApiOperation({ summary: 'Sign up new student' })
  @Public()
  async signUpStudent(@Body() signUpDto: SignupDto) {
    try {
      const newStudent = await this.authService.signUpStudent(signUpDto);
      await this.authService.createEmailToken(newStudent.email);
      //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
      var sent = await this.authService.sendEmailVerification(newStudent.email);
      if(sent){
        return new ResponseObject(true, 'Register successfully! Check your mail', newStudent);
      } else {
        return new ResponseObject(false, 'Error: Email not sent', newStudent);
      }
    } catch (e) {
      return new ResponseObject(false, 'Sign up fail', e.message);
    }
  }

  @Post('signup/teacher')
  @ApiOperation({ summary: 'Sign up new teacher' })
  @Public()
  async signUpTeacher(@Body() signUpDto: SignupDto) {
    try {
      const result = await this.authService.signUpTeacher(signUpDto);
      return new ResponseObject(true, 'Sign up successfully', result);
    } catch (e) {
      return new ResponseObject(false, 'Sign up fail', e.message);
    }
  }

  @Put('verify')
  @Public()
  public async verifyEmail(@Body() data: VerifyEmailDto) {
    try {
      const isEmailVerified = await this.authService.verifyEmail(data.email, data.token);
      return new ResponseObject(true, 'LOGIN.EMAIL_VERIFIED', isEmailVerified);
    } catch(error) {
      return new ResponseObject(false,'LOGIN.ERROR', error.message);
    }
  }

  @Get("resend-verification/:email")
  @Public()
  public async sendEmailVerification(@Param('email') email: string){
    try {
      await this.authService.createEmailToken(email);
      var isEmailSent = await this.authService.sendEmailVerification(email);
      if (isEmailSent) {
        return new ResponseObject(true, 'Email token resent!', isEmailSent);
      } else {
        return new ResponseObject(false, 'Email token not resent!', isEmailSent);
      }
    } catch (error) {
      return new ResponseObject(false, 'Email token resent error!', error.message);
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }
}
