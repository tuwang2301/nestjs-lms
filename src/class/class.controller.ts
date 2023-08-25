import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseObject } from '../common/ResponseObject';
import { AddClassDTO } from '../Class/dto/addClass.dto';
import { UpdateClassDTO } from '../Class/dto/updateClass.dto';
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";

@Controller('class')
@ApiTags('Class')
@ApiBearerAuth()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Classes' })
  async getAllClasses() {
    try {
      const result = await this.classService.getAllClasses();
      return new ResponseObject(true, 'All Classes', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get(':id')
  @ApiOperation({summary: 'Get class info'})
  async getClassInfo(@Param('id') id: number) {
    try {
      const result = await this.classService.getClassInfo(id);
      return new ResponseObject(true, 'Class info', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new Class' })
  @Authorities(Authority.Admin)
  async createClass(@Body() ClassDTO: AddClassDTO) {
    try {
      const result = await this.classService.createClass(ClassDTO);
      return new ResponseObject(true, 'Create successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Create fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update Class by id' })
  @Authorities(Authority.Admin)
  async updateClass(@Param('id') id: number, @Body() data: UpdateClassDTO) {
    try {
      const result = await this.classService.updateClass(id, data);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Update fail', error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete Class by id' })
  @Authorities(Authority.Admin)
  async deleteClasss(@Param('id') id: number) {
    try {
      const result = await this.classService.deleteClass(id);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }
}
