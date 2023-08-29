import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from 'class-validator';

@Entity()
export class EmailVerification {
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
