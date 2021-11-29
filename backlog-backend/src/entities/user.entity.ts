import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class User {
    @PrimaryColumn()
    user_id: string;

    @Column()
    email_address: string;

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];
}