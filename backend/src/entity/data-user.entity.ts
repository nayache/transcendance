import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class DataUserEntity {
    constructor(user: UserEntity) {
        this.user = user;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({default: 1})
    level: number

    @Column({default: 0})
    win: number
    
    @Column({default: 0})
    loose: number

    @OneToOne(() => UserEntity, (user) => user)
    user: UserEntity
}