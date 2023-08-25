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

@Entity()
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.student)
  @JoinColumn()
  user: Users;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  gender: Gender;

  @Column()
  dob: Date;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @JoinTable()
  subjects: Subject[];
}
