import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { ResponseObject } from '../common/ResponseObject';
import { AddCourseDto } from '../Course/dto/addCourse.dto';
import { UpdateCourseDto } from '../Course/dto/updateCourse.dto';
import { AssignTeacherDTO } from './dto/assignTeacher.dto';
import { Authorities } from '../auth/authorities.decorator';
import { Authority } from '../common/globalEnum';
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { CourseFilterDto } from "./dto/courseFilter.dto";

@Controller('course')
@ApiTags('Course')
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly CourseService: CourseService) {}
  @Get()
  @ApiOperation({ summary: 'Get all Courses' })
  async getAllCourses(
      @Query() pageOptionsDto: PageOptionsDto,
      @Query() courseFilter: CourseFilterDto
  ) {
    try {
      const result = await this.CourseService.getCourses(pageOptionsDto, courseFilter);
      return new ResponseObject(true, 'All Courses', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course info' })
  async getCourseInfo(@Param('id') id: number) {
    try {
      const result = await this.CourseService.getCourseInfo(id);
      return new ResponseObject(true, 'Course info', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new Course' })
  @Authorities(Authority.Teacher, Authority.Admin)
  async createCourse(@Body() CourseDTO: AddCourseDto) {
    try {
      const result = await this.CourseService.createCourse(CourseDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update Course by id' })
  @Authorities(Authority.Teacher, Authority.Admin)
  async updateCourse(@Param('id') id: number, @Body() data: UpdateCourseDto) {
    try {
      const result = await this.CourseService.updateCourse(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Put('assign-teacher')
  @ApiOperation({ summary: 'Assign teacher to course' })
  @Authorities(Authority.Teacher, Authority.Admin)
  async assignTeacher(@Body() assignDTO: AssignTeacherDTO) {
    try {
      const result = await this.CourseService.assignTeacher(assignDTO);
      return new ResponseObject(true, 'Assign successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Assign fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Course by id' })
  @Authorities(Authority.Teacher, Authority.Admin)
  async deleteCourse(@Param('id') id: number) {
    try {
      const result = await this.CourseService.deleteCourse(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
