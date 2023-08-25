import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../course/course.entity';
import { BaseEntity } from "../common/BaseEntity";

@Entity()
export class Class extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  student_number: number;

  @OneToMany(() => Course, (course) => course.class_room)
  courses: Course[];
}
