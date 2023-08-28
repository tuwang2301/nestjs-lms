import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';
import { Conduct, Gender, Rank } from '../common/globalEnum';
import { Enrollment } from '../enrollment/enrollment.entity';
import { BaseEntity } from '../common/BaseEntity';

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.student)
  @JoinColumn()
  user: Users;

  @Column()
  full_name: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'date',
  })
  dob: Date;

  @Column({
    type: 'enum',
    enum: Rank,
    nullable: true,
  })
  rank: Rank;

  @Column({
    type: 'enum',
    enum: Conduct,
    nullable: true,
  })
  conduct: Conduct;


  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
