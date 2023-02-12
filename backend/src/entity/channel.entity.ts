import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class Channel {
    constructor(name: string, owner: UserEntity, password?: string) {
        this.name = name;
        if (password) {
            this.private = true;
            this.password = password;
        }
        this.owner = owner;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    name: string;

    @ManyToOne(() => UserEntity, (owner) => owner)
    @JoinColumn({name: 'ownerId'})
    owner: UserEntity

    @Column({type: 'bool', default: false})
    private: boolean;

    @Column({default: null})
    password: string;
    
    @Column()
    ownerId: string
}