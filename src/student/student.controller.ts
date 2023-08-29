import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { StudentService } from "./student.service";
import { ResponseObject } from "../common/ResponseObject";
import { AddStudentDto } from "./dto/addStudent.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateStudentDto } from "./dto/updateStudent.dto";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { StudentFilterDto } from "./dto/student.filter.dto";

@Controller('student')
@ApiTags('Students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  async getListStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() studentFilter: StudentFilterDto,
  ) {
    try {
      const result = await this.studentService.getListStudents(pageOptionsDto, studentFilter);
      return new ResponseObject(true, 'All students', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('course/:id')
  @ApiOperation({ summary: 'Get all courses of student' })
  @Authorities(Authority.Admin, Authority.Teacher)
  async getCoursesOfStudent(@Param('id') id: number) {
    try {
      const result = await this.studentService.getCoursesOfStudent(id);
      return new ResponseObject(true, 'All courses:', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new student' })
  @Authorities(Authority.Admin)
  async createStudent(@Body(new ValidationPipe()) studentDTO: AddStudentDto) {
    try {
      const result = await this.studentService.addStudent(studentDTO);
      return new ResponseObject(true, 'Add successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Add fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update student by id' })
  @Authorities(Authority.Admin)
  async updateStudent(
    @Param('id') id: number,
    @Body() studentDTO: UpdateStudentDto,
  ) {
    try {
      const result = await this.studentService.updateStudent(id, studentDTO);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete student by id' })
  @Authorities(Authority.Admin)
  async deleteStudent(@Param('id') id: number) {
    try {
      const result = await this.studentService.deleteStudent(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
