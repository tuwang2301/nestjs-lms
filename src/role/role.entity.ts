import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';
import { BaseEntity } from '../common/BaseEntity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  role_id: number;
  @Column({ unique: true })
  authority: string;
  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
