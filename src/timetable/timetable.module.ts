import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from "../subject/subject.entity";
import { Timetable } from './timetable.entity';
import { Course } from 'src/course/course.entity';
import { TimetableService } from './timetable.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable, Course])],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule { }
