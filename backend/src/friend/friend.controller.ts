import { Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { AppGateway } from 'src/chat/app.gateway';
import { User } from 'src/decorators/user.decorator';
import { FriendEntity } from 'src/entity/friend.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { friendDto } from 'src/user/user.controller';
import { UserPreview, UserService } from 'src/user/user.service';

@Controller('users/friends')
export class FriendController {
    constructor(private userService: UserService,
    private readonly appGateway: AppGateway) {}

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
        await this.appGateway.friendEvent(eventName, user2.id, userId);
        const friends: FriendEntity[] = await this.userService.getFriends(userId, true);
        const friendList : friendDto[] = await this.userService.makeFriendList(userId, friends);
        return { friends: friendList }
    }

    @Delete('del/:pseudo')
    async deleteFriendship(@User() userId: string, @Param('pseudo') pseudo: string) {
        const user2: UserEntity = await this.userService.findByPseudo(pseudo);
        if (!user2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'target not found');
        if (userId === user2.id)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'invalid target(himself)');
        if (!await this.userService.friendshipExist(userId, user2.id) && !await this.userService.frienshipWaiting(userId, user2.id))
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'friendship not exist');
        else
            await this.userService.removeFriendship(userId, user2.id);
        const friends: FriendEntity[] = await this.userService.getFriends(userId, true);
        const friendList : friendDto[] = await this.userService.makeFriendList(userId, friends);
        return { friends: friendList }
    }

    @Get('list')
    async getFriendList(@User() userId: string) {
        const friends: FriendEntity[] = await this.userService.getFriends(userId, true);
        const friendList : friendDto[] = await this.userService.makeFriendList(userId, friends);
        const friendshipPendings: FriendEntity[] = await this.userService.getFriendshipInWaiting(userId);
        const pendings: UserPreview[] = await this.userService.makeList(friendshipPendings, userId);
        return { friends: friendList, pendings };
    }

    @Get('pending')
    async getPendings(@User() userId: string) {
        const friendshipPendings: FriendEntity[] = await this.userService.getFriendshipInWaiting(userId);
        const pendings: UserPreview[] = await this.userService.makeList(friendshipPendings, userId);
        return {pendings};
    }

    @Get(':/pseudo')
    async getFriend(@User() userId: string, @Param('pseudo') pseudo: string) {
        if (!pseudo)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.EMPTY, 'empty arg');
    }
}
