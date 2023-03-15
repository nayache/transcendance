import { Body, Controller, forwardRef, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { AppGateway } from 'src/chat/app.gateway';
import { User } from 'src/decorators/user.decorator';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export function matchDifficulty(difficulty: Difficulty): boolean {
    return (difficulty === "easy" || difficulty === "medium" || difficulty === "hard");
}

export class startInfosDto {
    width: number;
    height: number;
    y: number;
}

export class Match {
    id: string;
    player1: string;
    player2: string;
}

@Controller('game')
export class GameController {
        constructor(@Inject(forwardRef(() => GameService))private gameService: GameService,
            @Inject(forwardRef(() => AppGateway)) private readonly appGateway: AppGateway) {}

    @Post('search/:difficulty')
    async searchOpponent(@User() userId: string, @Param('difficulty') difficulty: Difficulty) {
        console.log('search game in -> ', difficulty, )
        if (!matchDifficulty(difficulty))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.INVALID, 'invalid difficulty argument');
        if (this.gameService.isInMatchmaking(userId))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.REJECTED, 'user is already looking for a match');
        if (this.gameService.isInGame(userId))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.REJECTED, 'user is already ingame');
        const { id, player1, player2 } = await this.gameService.searchOpponent(userId, difficulty);
        if (id)
            this.appGateway.matchEvent(id, player1, player2, difficulty);
        return {}
    }

    @Post('create')
    async createGame(@User() userId: string, @Body() infos: startInfosDto) {
       //this.gameService.createGame(userId, infos);
    }

    @Post('infos')
    async saveInfos(@User() userId: string) {

    }
}
