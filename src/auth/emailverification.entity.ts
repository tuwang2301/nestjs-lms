import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from 'class-validator';

@Entity()
export class Emailverification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;
  @Column()
  emailToken: string;
  @Column({
    type: 'timestamp',
  })
  timestamp: Date;
}
