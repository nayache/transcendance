import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Column, CreateDateColumn } from "typeorm";
import { UserEntity } from "../../entity/user.entity";

@Entity()
export class PrivateMessageEntity {
    constructor(author: UserEntity, target: UserEntity, content: string) {
        this.author = author;
        this.target = target;
        this.content = content;
    }

    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => UserEntity, (author) => author, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'authorId'})
    author: UserEntity;
    
    @ManyToOne(() => UserEntity, (target) => target, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'targetId'})
    target: UserEntity;

    @Column({nullable: false})
    authorId: string;
    
    @Column({nullable: false})
    targetId: string;

    @Column({default: false})
    content: string;

    @CreateDateColumn()
    created_at: Date;
}