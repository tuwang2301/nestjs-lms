import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Users } from "../users/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Users])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
