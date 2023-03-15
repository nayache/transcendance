import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class DataUserEntity {
    constructor(user: UserEntity) {
        this.user = user;
        this.achievements = [];
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({default: 1})
    level: number;

    @Column({default: 0})
    win: number;
    
    @Column({default: 0})
    loose: number;

    @Column({default: 0})
    xp: number;

    @Column({type: 'text', array: true})
    achievements: string[];

    @ManyToOne(() => UserEntity, (user) => user, {onDelete: 'CASCADE'})
    user: UserEntity;
}