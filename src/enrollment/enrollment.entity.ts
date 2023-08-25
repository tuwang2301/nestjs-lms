import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../course/course.entity';
import { Student } from '../student/student.entity';
import { BaseEntity } from "../common/BaseEntity";

@Entity()
export class Enrollment extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments)
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn()
  course: Course;

  @Column()
  enroll_date: Date;
}
