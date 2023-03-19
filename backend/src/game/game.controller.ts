import { Body, Controller, Delete, forwardRef, Get, HttpStatus, Inject, Param, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AppGateway, GameDto } from 'src/chat/app.gateway';
import { ValidationFilter } from 'src/chat/filter/validation-filter';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { UserService } from 'src/user/user.service';
import { GameEntity } from './game.entity';
import { Challenge, GameService } from './game.service';

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export function matchDifficulty(difficulty: string): Difficulty {
    if (difficulty === "easy")
        return Difficulty.EASY
    if (difficulty === "medium")
        return Difficulty.MEDIUM
    if (difficulty === "hard")
        return Difficulty.HARD
    return null;
}


export class startInfosDto {
    width: number;
    height: number;
    y: number;
}

export class inviteGameDto {

    @IsString()
    @IsNotEmpty()
    target: string;
    
    @IsString()
    @IsNotEmpty()
    difficulty: string;
}

export class acceptInvitationDto{
    @IsString()
    @IsNotEmpty()
    target: string;
    
    @IsBoolean()
    @IsNotEmpty()
    response: boolean;
}


@UsePipes(ValidationPipe)
@UseFilters(ValidationFilter)
@Controller('game')
export class GameController {
        constructor(@Inject(forwardRef(() => GameService))private gameService: GameService,
            @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
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
        const game: GameEntity = await this.gameService.searchOpponent(userId, difficulty);
        if (game)
            await this.appGateway.matchEvent(game);
        return {}
    }

    @Post('invite')
    async inviteGame(@User() userId: string, @Body() payload: inviteGameDto) {
        console.log(payload);
        const difficulty: Difficulty = matchDifficulty(payload.difficulty);
        if (!difficulty)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.INVALID, 'invalid difficulty argument');
        if (this.gameService.isInMatchmaking(userId))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.REJECTED, 'user is already looking for a match');
        if (this.gameService.isInGame(userId))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.REJECTED, 'user is already ingame');
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'cant invite himself');
        if (this.gameService.isInGame(target.id))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.REJECTED, 'target is already ingame');
        this.gameService.createChallenge(userId, target.id, difficulty);
        await this.appGateway.inviteGame(userId, target.id, target.pseudo, difficulty);
        return {}
    }

    @Post('accept')
    async acceptGame(@User() userId: string, @Body() payload: acceptInvitationDto) {
     //   if (!pseudo)        
      //      throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.EMPTY, 'empty arg');
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'cant accept himself');
        if (this.gameService.isInGame(target.id))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.REJECTED, 'target is already ingame');
        if (this.gameService.isInGame(userId))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.REJECTED, 'user is already ingame');
        const invitation: Challenge = this.gameService.findChallenge(target.id, userId);
        if (!invitation)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.REJECTED, 'invitation does not exist or is expired');
        if (payload.response === true) {
            const game: GameEntity = await this.gameService.startChallenge(invitation);
            if (!game)
                throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.REJECTED, 'cant start game');
            this.appGateway.matchEvent(game);
        } else {
            this.gameService.deleteChallenge(invitation);
            this.appGateway.declineGame(target.id);
        }
        return {}
    }

    @Delete('invite')
    async deleteChallenge(@User() userId: string, @Body() payload: inviteGameDto) {
        const difficulty: Difficulty = matchDifficulty(payload.difficulty);
        if (!difficulty)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.INVALID, 'invalid difficulty argument');
        const target: UserEntity = await this.userService.findByPseudo(payload.target);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID);
        const invitation: Challenge = this.gameService.findChallenge(userId, target.id);
        if (!invitation)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.REJECTED, 'invitation does not exist or is expired');
        this.gameService.deleteChallenge(invitation);
        return {}
    }



    @Post('view/:pseudo')
    async viewGame(@User() userId: string, @Param('pseudo') pseudo: string) {
        if (!pseudo)        
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.EMPTY, 'empty arg');
        const target: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (target.id === userId)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'cant view himself');
        if (!this.gameService.isInGame(target.id))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'target is not in a game');
        const game: GameEntity = await this.gameService.getLastGame(target.id);
        if (!game)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.GAME, TypeErr.NOT_FOUND, 'game not found');
        return { gameId: game.id }
    }

    @Get('infos/:id')
    async getGameInfos(@Param('id') id: string) {
        if (!id)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.GAME, TypeErr.EMPTY, 'empty arg');
        const game: GameDto = await this.gameService.getGameInfos(id);
        if (!game)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.GAME, TypeErr.NOT_FOUND, 'game not found');
        return { infos: game };
    }

    @Delete('view')

    @Post('create')
    async createGame(@User() userId: string, @Body() infos: startInfosDto) {
       //this.gameService.createGame(userId, infos);
    }

    @Post('infos')
    async saveInfos(@User() userId: string) {

    }
}
