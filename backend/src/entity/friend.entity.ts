import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Column } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
@Unique(['user1', 'user2'])
export class FriendEntity {
    constructor(user1: UserEntity, user2: UserEntity) {
        this.user1 = user1;
        this.user2 = user2;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => UserEntity, (user1) => user1, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'user1Id'})
    user1: UserEntity
    
    @ManyToOne(() => UserEntity, (user2) => user2, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'user2Id'})
    user2: UserEntity

    @Column({nullable: false})
    user1Id: string
    
    @Column({nullable: false})
    user2Id: string
}