import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationToken } from "./notification-token.entity";
@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'notification_token_id', referencedColumnName: 'id' })
    @ManyToOne(() => NotificationToken)
    notification_token: NotificationToken;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    created_by: string;

    @Column({
        default: 'ACTIVE',
    })
    status: string;
}
