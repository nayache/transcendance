import { UserEntity } from "src/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Difficulty } from "./game.controller";

@Entity()
export class GameEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'bool'})
    ranked: boolean;
    
    @Column()
    Difficulty: Difficulty;

    @ManyToOne(() => UserEntity, (player1) => player1, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'player1Id'})
    player1: UserEntity;
    
    @ManyToOne(() => UserEntity, (player2) => player2, {eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'player2Id'})
    player2: UserEntity;
    
    @Column()
    player1Id: string;
    
    @Column()
    player2Id: string;

    @Column()
    score1: number = 0;
    
    @Column()
    score2: number = 0;

    @Column({default: 0})
    xp1: number = 0;
    
    @Column({default: 0})
    xp2: number = 0;

    @Column({type: 'bool' , default: false})
    forfeit: boolean = false;

    @Column({type: 'bool' , default: false})
    started: boolean = false;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

    constructor(player1: UserEntity, player2: UserEntity, difficulty: Difficulty, ranked: boolean) {
        this.player1 = player1;
        this.player2 = player2;
        this.Difficulty = difficulty;
        this.score1, this.score2 = 0;
        this.xp1, this.xp2 = 0;
        this.ranked = ranked;
    }
}