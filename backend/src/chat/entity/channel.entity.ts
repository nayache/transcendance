import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { MessageEntity } from "./message.entity";
import { Mute } from "./mute.entity";

@Entity()
export class ChannelEntity {
    constructor(name: string, prv: boolean, password?: string) {
        this.name = name;
        this.private = prv;
        this.password = (password) ? password : null;
        this.visited = 0;
        this.banneds = [];
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string;
   
    @OneToOne(() => Member, (member) => (member.channel), { cascade: true })
    members: Member[];

    @Column({type: 'bool'})
    private: boolean = false;
    
    @Column({nullable: true})
    password: string;

    @Column({nullable: false})
    visited: number;
    
    @Column({type: 'text' ,array: true})
    banneds: string[];

    @OneToOne(() => Mute, (muteds) => (muteds.channel), {cascade: true})
    muteds: Mute[];
    
    @OneToOne(() => MessageEntity, (messages) => messages.channel, { cascade: true })
    messages: MessageEntity[];
}