import { Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { User } from 'src/decorators/user.decorator';
import { FriendEntity } from 'src/entity/friend.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { friendDto } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Controller('users/friends')
export class FriendController {
    constructor(private userService: UserService,
    private readonly chatGateway: ChatGateway) {}

    @Post('add/:pseudo')
    async makeFriend(@User() userId: string, @Param('pseudo') pseudo: string) {
        const user2: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (userId == user2.id)
            throw new ErrorException(HttpStatus.CONFLICT, AboutErr.TARGET, TypeErr.INVALID, 'cant add himself has friend');
        // si j'ai deja envoyer une requete a cet user ou bien si je suis deja ami avec lui
        if (await this.userService.friendshipExist(userId, user2.id))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'already added friend');
        let eventName: string = 'newRequest';
        if (await this.userService.frienshipWaiting(userId, user2.id)) {
            await this.userService.acceptFriendship(userId, user2.id);
            eventName = 'acceptedRequest;'
        }
        else
            await this.userService.createFriendship(userId, user2.id);
        this.chatGateway.friendEvent(eventName, user2.id, pseudo);
    }

    @Delete('del/:pseudo')
    async deleteFriendship(@User() userId: string, @Param('pseudo') pseudo: string) {
        const user2: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (userId === user2.id)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'invalid target(himself)');
        if (!await this.userService.friendshipExist(userId, user2.id))
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'friendship not exist');
        else
            return this.userService.removeFriendship(userId, user2.id);
    }

    @Get('list')
    async getFriendList(@User() userId: string) {
        const friends: FriendEntity[] = await this.userService.getFriends(userId, true);
        const friendList : friendDto[] = await this.userService.makeFriendList(userId, friends);
        const friendshipPendings: FriendEntity[] = await this.userService.getFriendshipInWaiting(userId);
        const pendings: string[] = await this.userService.makeList(friendshipPendings, userId);
        return { friends: friendList, pendings };
    }
/*
    @Get('/:pseudo/:value')
    async getUserFriendList(@Param('value') value: boolean, @Param('pseudo') pseudo: string) {
        if (value != true && value != false)
            throw new HttpException('invalid param set ` true or false `', HttpStatus.BAD_REQUEST);
        const user: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
        const friends = await this.userService.getFriends(user.id, value);
        const friendList : string[] = await this.userService.makeFriendList(user.id, friends);
        return { friends: friendList }
    } */
   
    //FOR TESTTTTTT
    @Patch('add')
    async addFriend(@Query('src') src: string, @Query('dst') dst: string) {
        console.log('src: ', src, ' dst: ', dst)
        if (await this.userService.friendshipExist(src, dst)) {
            throw new HttpException('already friend(or in waiting)', HttpStatus.BAD_REQUEST);
        }
        // si j'ai deja une requete d'ami se sa part en attente
        else if (await this.userService.frienshipWaiting(src, dst))
            return this.userService.acceptFriendship(src, dst)
        else
            return this.userService.createFriendship(src, dst);
    }

    //FOR TESTTTTTT
    @Delete('rm')
    async rmFriend(@Query('src') src: string, @Query('dst') dst: string) {
        console.log('src: ', src, ' dst: ', dst)
        if (!await this.userService.friendshipExist(src, dst) || !await this.userService.friendshipPendingFromOther(src, dst))
            throw new HttpException('friendship not exist', HttpStatus.BAD_REQUEST);
        else
            return this.userService.removeFriendship(src, dst);
    }
}
