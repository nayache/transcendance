import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity()
export class MessageEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ChannelEntity, (channel) => channel.messages, {eager:true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'channelId'})
    channel: ChannelEntity;

    @Column()
    channelId: string;

    @Column()
    author: string;

    @Column()
    color: string;

    @Column()
    content: string

    @CreateDateColumn()
    created_at: Date;

    constructor(channel: ChannelEntity, author: string, color: string, content: string) {
        this.channel = channel;
        this.author = author;
        this.color = color;
        this.content = content;
    }
}