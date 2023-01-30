//import { ExistingProvider } from "@nestjs/common";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DataUserEntity } from "./data-user.entity";
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

  //  @OneToOne(() => DataUserEntity, (data) => data.user, {onDelete: 'CASCADE'})
  //  @JoinColumn()
  //  data: DataUserEntity
}