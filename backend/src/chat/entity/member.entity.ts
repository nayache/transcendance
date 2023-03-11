import { channel } from "diagnostics_channel";
import { join } from "path";
import { UserEntity } from "src/entity/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { ChannelRole } from "../../enums/channel-role.enum";

@Entity()
export class Member {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (user) => user, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column({nullable: false})
    userId: string;

    @ManyToOne(() => ChannelEntity, (channel) => (channel.members), { eager: true, onDelete:'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'channelId'})
    channel: ChannelEntity;

    @Column({nullable: false})
    channelId: string;

    @Column({default: ChannelRole.USER})
    role: ChannelRole;

    @Column({nullable: false})
    color: string;

    @Column({default: null})
    unmuteDate: Date;

    constructor(user: UserEntity, channel: ChannelEntity, color: string, role: ChannelRole, unmuteDate: Date) {
        this.user = user;
        this.channel = channel;
        this.role = role
        this.color = color;
        this.unmuteDate = unmuteDate;
    }
}