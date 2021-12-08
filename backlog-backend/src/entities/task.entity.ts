import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    task_id: number;

    @ManyToOne(() => User, user=>user.tasks)
    user: User;

    @Column({nullable: false})
    task_name: string;

    @Column()
    time_estimate: number; // Stored in minutes

    @Column()
    expiration_date: Date;

    @ManyToOne(() => Category, category => category.tasks)
    category: Category;

    setCategory(cat: Category) {
        this.category = cat;
    }

}