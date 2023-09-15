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
import { Conduct, Gender, Rank } from '../common/globalEnum';
import { Course } from '../course/course.entity';
import { BaseEntity } from '../common/BaseEntity';
import { Subject } from '../subject/subject.entity';
import { Profile } from "../common/ProfileEntity";

@Entity()
export class Teacher extends Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.student)
  @JoinColumn()
  user: Users;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable()
  subjects: Subject[];
}
