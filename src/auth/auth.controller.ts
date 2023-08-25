import {
  Body,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersDTO } from '../users/dto/users.dto';
import { ResponseObject } from '../common/ResponseObject';
import { Public } from '../common/custom.decorator';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from "../users/users.service";

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
      const result = await this.authService.signUpStudent(signUpDto);
      return new ResponseObject(true, 'Sign up successfully', result);
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

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }
}
