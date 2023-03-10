import { UserEntity } from "src/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

@Entity()
export class Mute {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ChannelEntity, (channel) => (channel.muteds), { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'channelId'})
    channel: ChannelEntity;
    
    @Column({nullable: false})
    channelId: string;

    @ManyToOne(() => UserEntity, (user) => user, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name: 'userId'})
    user: UserEntity;
    
    @Column({nullable: false})
    userId: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({nullable: false})
    duration: number;

    constructor(channel: ChannelEntity, user: UserEntity, duration: number) {
        this.channel = channel;
        this.user = user;
        this.duration = duration;
    }
}