import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
  AfterLoad,
} from 'typeorm';
import { Teacher } from '../teacher/teacher.entity';
import { Role } from '../role/role.entity';
import { Student } from '../student/student.entity';
import { UsersDTO } from './dto/users.dto';
import { BaseEntity } from '../common/BaseEntity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @AfterLoad()
  async nullChecks() {
    if (!this.roles) {
      this.roles = [];
    }
  }

  parseUsers(userDTO: UsersDTO) {
    this.username = userDTO.username;
    this.password = userDTO.password;
  }
}
