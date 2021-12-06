import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    task_id: number;

    @ManyToOne(() => User, user=>user.tasks)
    user: User;

    @Column({nullable: false})
    task_name: string;

    @ManyToMany(() => Category, category => category.tasks)
    @JoinTable()
    categories: Category[];

    @Column()
    time_estimate: number; // Stored in minutes

    @Column()
    expiration_date: Date;

    // @Column()
    // priority: number

}