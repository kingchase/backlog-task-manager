import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity, JoinColumn, OneToMany } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    @JoinColumn()
    category_id: number;

    @Column()
    category_name: string;

    @OneToMany(() => Task, task => task.category)
    tasks: Task[]
}