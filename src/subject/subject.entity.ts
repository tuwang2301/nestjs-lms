import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../course/course.entity';
import { BaseEntity } from '../common/BaseEntity';
import { Teacher } from '../teacher/teacher.entity';

@Entity()
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  credit: number;

  @OneToMany(() => Course, (course) => course.subject)
  courses: Course[];

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers: Teacher[];
}
