import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  Request
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { ResponseObject } from '../common/ResponseObject';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { AddSubjectDto } from './dto/addSubject.dto';
import { Authorities } from '../auth/authorities.decorator';
import { Authority } from '../common/globalEnum';
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { Public } from "../common/custom.decorator";
@Controller('subject')
@ApiTags('Subject')
@ApiBearerAuth()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @Public()
  async getAllSubjects(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() subjectFilter: UpdateSubjectDto,
  ) {
    try {
      const result = await this.subjectService.getAllSubjects(pageOptionsDto, subjectFilter);
      return new ResponseObject(true, 'All Subjects', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new subject' })
  // @Authorities(Authority.Admin)
  async createSubject(@Body() subjectDTO: AddSubjectDto) {
    try {
      const result = await this.subjectService.createSubject(subjectDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update subject by id' })
  @Authorities(Authority.Admin)
  async updateSubject(@Param('id') id: number, @Body() data: UpdateSubjectDto) {
    try {
      const result = await this.subjectService.updateSubject(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete subject by id' })
  @Authorities(Authority.Admin)
  async deleteSubject(@Param('id') id: number) {
    try {
      const result = await this.subjectService.deleteSubject(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
