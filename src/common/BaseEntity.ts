import {
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

export abstract class BaseEntity {
  @CreateDateColumn()
  created;

  @UpdateDateColumn()
  updated;

  @OneToOne(() => Users)
  @JoinColumn()
  created_by: Users;

  @OneToOne(() => Users)
  @JoinColumn()
  updated_by: Users;
}
