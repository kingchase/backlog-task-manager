import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column()
    category_name: string;

    @ManyToMany(() => Task, task => task.categories)
    tasks: Task[]
}