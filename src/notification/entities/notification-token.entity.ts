import { Users } from 'src/users/users.entity';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification_tokens' })
export class NotificationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    @ManyToOne(() => Users)
    user: Users;

    @Column()
    notification_token: string;

    @Column({
        default: 'ACTIVE',
    })
    status: string;
}