import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TeacherService } from "./teacher.service";
import { ResponseObject } from "../common/ResponseObject";
import { UpdateTeacherDto } from "./dto/updateTeacher.dto";
import { addTeacherDto } from "./dto/addTeacher.dto";
import { AssignSubjectDto } from "./dto/assignSubject.dto";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { UpdateSubjectDto } from "../subject/dto/updateSubject.dto";
import { Public } from "../common/custom.decorator";

@Controller('teacher')
@ApiTags('Teacher')
@ApiBearerAuth()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @Public()
  async getTeachersPagination(
    @Query() pageOptionsDto : PageOptionsDto,
    @Query() teacherFilterDto : UpdateTeacherDto,
  ) {
    try {
      const result = await this.teacherService.getTeachersPagination(pageOptionsDto, teacherFilterDto);
      return new ResponseObject(true, 'All teachers', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('all-teachers')
  @ApiOperation({ summary: 'Get all teachers' })
  @Public()
  async getAllTeachers() {
    try {
      const result = await this.teacherService.getAllTeachers();
      return new ResponseObject(true, 'All Teachers', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('subjects/:id')
  @ApiOperation({ summary: 'Get all subjects of teacher' })
  @Authorities(Authority.Admin, Authority.Teacher)
  async getAllSubjectsOfTeacher(@Param('id') id: number) {
    try {
      const result = await this.teacherService.getAllSubjectsOfTeacher(id);
      return new ResponseObject(true, 'All subjects', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get all courses of teacher' })
  @Authorities(Authority.Admin, Authority.Teacher)
  async getAllCoursesOfTeacher(@Param('id') id: number) {
    try {
      const result = await this.teacherService.getAllCoursesOfTeacher(id);
      return new ResponseObject(true, 'All subjects', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new teacher' })
  @Authorities(Authority.Admin)
  async createTeacher(@Body() teacherDTO: addTeacherDto) {
    try {
      const result = await this.teacherService.createTeacher(teacherDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update teacher by id' })
  @Authorities(Authority.Admin)
  async updateTeacher(@Param('id') id: number, @Body() data: UpdateTeacherDto) {
    try {
      const result = await this.teacherService.updateTeacher(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Put('assign-subject')
  @ApiOperation({ summary: 'Assign subject to teacher' })
  @Authorities(Authority.Admin)
  async assignSubject(@Body() assignDTO: AssignSubjectDto) {
    try {
      const result = await this.teacherService.assignSubject(assignDTO);
      return new ResponseObject(true, 'Assign successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Assign fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete teacher by id' })
  @Authorities(Authority.Admin)
  async deleteTeacher(@Param('id') id: number) {
    try {
      const result = await this.teacherService.deleteTeacher(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
