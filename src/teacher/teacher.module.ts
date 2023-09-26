import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Subject } from "../subject/subject.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Teacher,Subject])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
