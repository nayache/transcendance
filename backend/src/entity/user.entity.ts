//import { ExistingProvider } from "@nestjs/common";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendEntity } from "./friend.entity";

@Entity()
export class UserEntity {

    constructor(login: string) {
        this.login = login;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string
    
    @Column()
    login: string
    
    @Column({ default: null })
    pseudo: string

    @Column({ default: null })
    TwoFaSecret: string

    @Column({ type: "bool", default: false })
    twoFaEnabled: boolean;
}