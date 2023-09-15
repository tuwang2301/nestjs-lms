import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../subject/subject.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Class } from '../class/class.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { BaseEntity } from "../common/BaseEntity";

@Entity()
export class Course extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  @JoinColumn()
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn()
  teacher: Teacher;

  @Column()
  start_at: Date;

  @Column()
  end_at: Date;

  @Column()
  image: string;

  @Column({nullable: true})
  description: string;

  @ManyToOne(() => Class, (class_room) => class_room.courses)
  @JoinColumn()
  class_room: Class;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
