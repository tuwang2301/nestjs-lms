import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EnrollmentService } from "./enrollment.service";
import { ResponseObject } from "../common/ResponseObject";
import { AddEnrollmentDTO } from "../Enrollment/dto/addEnrollment.dto";
import { UpdateEnrollmentDTO } from "../Enrollment/dto/updateEnrollment.dto";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { Public } from "../common/custom.decorator";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Controller('enrollment')
@ApiTags('Enrollment')
@ApiBearerAuth()
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly jwtService: JwtService,
    private readonly usersService : UsersService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all Enrollments' })
  @Authorities(Authority.Admin)
  async getAllEnrollments(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() enrollmentFilter: UpdateEnrollmentDTO,
  ) {
    try {
      const result = await this.enrollmentService.getAllEnrollments(pageOptionsDto, enrollmentFilter);
      return new ResponseObject(true, 'All Enrollmentes', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('most-enrolled')
  @ApiOperation({summary: 'Get the most enrolled course'})
  @Public()
  async getMostEnrolledCourse(){
    try {
      const result = await this.enrollmentService.getMostEnrolledCourse();
      return new ResponseObject(true, 'Most enrolled course', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get courses of student' })
  async getCoursesOfStudent(@Headers() headers) {
    try {
      const user = await this.usersService.getUserByToken(headers.authorization);
      const result = await this.enrollmentService.getCoursesOfStudent(user.student.id);
      return new ResponseObject(true, 'All courses of student', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('students/:id')
  @ApiOperation({ summary: 'Get students of course' })
  @Authorities(Authority.Teacher, Authority.Admin)
  async getStudentsOfCourse(@Param('id') courseId:number) {
    try {
      let result = await this.enrollmentService.getStudentsOfCourse(courseId);
      return new ResponseObject(true, 'All students of course', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get(':studentId/:courseId')
  @ApiOperation({ summary: 'Check enrollment' })
  async checkEnrollment(@Param('studentId') studentId:number,@Param('courseId') courseId:number,) {
    try {
      let data = await this.enrollmentService.checkEnrollment(studentId,courseId);
      const result = data ? true : false;
      return new ResponseObject(true, 'Enrollment status', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new Enrollment' })
  @Authorities(Authority.Admin, Authority.Student)
  async createEnrollment(@Body() EnrollmentDTO: AddEnrollmentDTO) {
    try {
      const result =
        await this.enrollmentService.createEnrollment(EnrollmentDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Post('enroll/:id')
  @ApiOperation({ summary: 'Enroll to new Course' })
  @Authorities(Authority.Admin, Authority.Student)
  async EnrollCourse(@Param('id') courseId:number, @Headers() headers) {
    try {
      const user = await this.usersService.getUserByToken(headers.authorization);
      const data = {
        student_id: user.student.id,
        course_id: courseId,
        enroll_date: new Date()
      }
      const result =
        await this.enrollmentService.createEnrollment(data);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Delete('unenroll/:id')
  @ApiOperation({ summary: 'Create new Enrollment' })
  @Authorities(Authority.Admin, Authority.Student)
  async UnenrollCourse(@Param('id') courseId:number, @Headers() headers) {
    try {
      const user = await this.usersService.getUserByToken(headers.authorization);
      const student_id = user.student.id;
      const result = await this.enrollmentService.unenrollCourse(student_id, courseId);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update Enrollment by id' })
  @Authorities(Authority.Admin)
  async updateEnrollment(
    @Param('id') id: number,
    @Body() data: UpdateEnrollmentDTO,
  ) {
    try {
      const result = await this.enrollmentService.updateEnrollment(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Enrollment by id' })
  @Authorities(Authority.Admin, Authority.Student)
  async deleteEnrollment(@Param('id') id: number) {
    try {
      const result = await this.enrollmentService.deleteEnrollment(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }


}
