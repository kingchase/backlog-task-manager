import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email_address: string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @Column({nullable: false})
    external_id: number;
}