//import { ExistingProvider } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Avatar } from "./avatar.entity";
@Entity()
export class UserEntity {

    constructor(login: string) {
        this.login = login;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string
    
	@OneToOne(() => Avatar, (avatar) => avatar.user)
  	avatar: Avatar;

    @Column()
    login: string
    
    @Column({ default: null })
    pseudo: string

    @Column({ default: null })
    TwoFaSecret: string

    @Column({ type: "bool", default: false })
    twoFaEnabled: boolean;
}
