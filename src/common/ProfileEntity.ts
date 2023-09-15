import { BaseEntity } from "./BaseEntity";
import { Column } from "typeorm";
import { Gender } from "./globalEnum";

export abstract class Profile extends BaseEntity{
    @Column()
    full_name: string;

    @Column({
        nullable: true,
    })
    gender: Gender;

    @Column({
        type: 'date',
        nullable: true
    })
    dob: Date;

    @Column({
        nullable: true,
    })
    address: string;

    @Column({
        nullable: true,
    })
    avatar: string;
}