import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { ResponseObject } from '../common/ResponseObject';
import { AddEnrollmentDTO } from '../Enrollment/dto/addEnrollment.dto';
import { UpdateEnrollmentDTO } from '../Enrollment/dto/updateEnrollment.dto';
import { Authorities } from '../auth/authorities.decorator';
import { Authority } from '../common/globalEnum';

@Controller('enrollment')
@ApiTags('Enrollment')
@ApiBearerAuth()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Enrollments' })
  @Authorities(Authority.Admin)
  async getAllEnrollments() {
    try {
      const result = await this.enrollmentService.getAllEnrollments();
      return new ResponseObject(true, 'All Enrollmentes', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment info' })
  @Authorities(Authority.Admin)
  async getEnrollmentInfo(@Param('id') id: number) {
    try {
      const result = await this.enrollmentService.getEnrollmentInfo(id);
      return new ResponseObject(true, 'All Enrollmentes', result);
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
