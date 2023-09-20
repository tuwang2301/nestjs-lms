import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';
import { Conduct, Gender, Rank, Timeframe, Weekday } from '../common/globalEnum';
import { Course } from '../course/course.entity';
import { BaseEntity } from '../common/BaseEntity';
import { Subject } from '../subject/subject.entity';
import { Profile } from "../common/ProfileEntity";

@Entity()
export class Timetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekday: Weekday

  @Column()
  timeframe: Timeframe

  @ManyToMany(() => Course, (course) => course.timetables)
  courses: Course[]
}
