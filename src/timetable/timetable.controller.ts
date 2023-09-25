import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseObject } from "../common/ResponseObject";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { Public } from "../common/custom.decorator";
import { TimetableService } from "./timetable.service";
import { updateTimetableDTO } from "./dto/updateTimetable.dto";
import { addTimetableDTO } from "./dto/addTimetable.dto";
import { timetableFilter } from "./dto/timetableFilter.dto";
import { scheduleCourseDTO } from "./dto/scheduleCourse.dto";
import { unscheduleCourseDTO } from "./dto/unscheduleCourse.dto";

@Controller('timetable')
@ApiTags('Timetable')
@ApiBearerAuth()
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) { }
  @Get()
  @ApiOperation({ summary: 'Get all Timetables' })
  @Public()
  async getTimetablesPagination(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() timetableFilter: timetableFilter,
  ) {
    try {
      const result = await this.timetableService.getTimetablePagination(pageOptionsDto, timetableFilter);
      return new ResponseObject(true, 'All Timetables', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('all-timetable')
  @ApiOperation({ summary: 'Get all Timetables' })
  @Public()
  async getAllTimetables() {
    try {
      const result = await this.timetableService.getAllTimetables();
      return new ResponseObject(true, 'All Timetables', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('get-timetable')
  @ApiOperation({ summary: 'Get Timetable by filter' })
  @Public()
  async getTimetable(
    @Query() timetableFilter: timetableFilter,
  ) {
    try {
      const result = await this.timetableService.getTimetable(timetableFilter);
      return new ResponseObject(true, 'All Timetables', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new Timetable' })
  @Authorities(Authority.Admin)
  async createTimetable(@Query() TimetableDTO: addTimetableDTO) {
    try {
      const result = await this.timetableService.createTimetable(TimetableDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }


  @Post('schedule-course')
  @ApiOperation({ summary: 'Schedule course' })
  @Authorities(Authority.Admin)
  async scheduleCourse(@Body() scheduleCourseDTO: scheduleCourseDTO) {
    try {
      const result = await this.timetableService.scheduleCourse(scheduleCourseDTO);
      return new ResponseObject(true, 'Schedule successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Schedule fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update Timetable by id' })
  @Authorities(Authority.Admin)
  async updateTimetable(@Param('id') id: number, @Body() data: updateTimetableDTO) {
    try {
      const result = await this.timetableService.updateTimetable(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }


  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Timetable by id' })
  @Authorities(Authority.Admin)
  async deleteTimetable(@Param('id') id: number) {
    try {
      const result = await this.timetableService.deleteTimetable(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
  @Delete('delete-schedule')
  @ApiOperation({ summary: 'Delete schedule by id' })
  // @Authorities(Authority.Admin)
  @Public()
  async deleteSchedule(@Query() unscheduleCourseDTO: unscheduleCourseDTO) {
    try {
      const result = await this.timetableService.deleteSchedule(unscheduleCourseDTO.course_id, unscheduleCourseDTO.timetable_id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
