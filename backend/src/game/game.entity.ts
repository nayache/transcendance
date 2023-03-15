import { UserEntity } from "src/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Difficulty } from "./game.controller";

@Entity()
export class GameEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    Difficulty: Difficulty;

    @ManyToOne(() => UserEntity, (player1) => player1, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'player1Id'})
    player1: UserEntity;
    
    @ManyToOne(() => UserEntity, (player2) => player2, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'player2Id'})
    player2: UserEntity;
    
    @Column()
    score1: number = 0;
    
    @Column()
    score2: number = 0;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

    constructor(player1: UserEntity, player2: UserEntity, difficulty: Difficulty) {
        this.player1 = player1;
        this.player2 = player2;
        this.Difficulty = difficulty;
        this.score1, this.score2 = 0;
    }
}