import { Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';

@Controller('user/friend')
export class FriendController {
    constructor(private userService: UserService) {}

    @Post('add/:id')
    async makeFriend(@User() userId: string, @Param('id') id: string) {
        if (userId == id)
            throw new HttpException('cant add himself as friend !', HttpStatus.CONFLICT);
        // si j'ai deja envoyer une requete a cet user ou bien si je suis deja ami avec lui
        if (await this.userService.friendshipExist(userId, id)) {
            throw new HttpException('already friend(or in waiting)', HttpStatus.BAD_REQUEST);
        }
        else if (await this.userService.frienshipWaiting(userId, id))
            return this.userService.acceptFriendship(userId, id)
        else
            return this.userService.createFriendship(userId, id);
    }

    @Delete('del/:id')
    async deleteFriendship(@User() userId: string, @Param('id') id: string) {
        if (!await this.userService.friendshipExist(userId, id))
            throw new HttpException('friendship not exist', HttpStatus.BAD_REQUEST);
        else
            return this.userService.removeFriendship(userId, id);
    }

    @Get('/:value')
    async getFriendList(@User() userId: string, @Param('value') value: boolean) {
        if (value != true && value != false)
            throw new HttpException('invalid param set ` true or false `', HttpStatus.BAD_REQUEST)
        const friends = await this.userService.getFriends(userId, value);
        const friendList : string[] = await this.userService.makeFriendList(userId, friends);
        return { friends: friendList }
    }
   
    //for test
    @Get('list')
    async getList(@Query('id') id: string) {
        const friends = await this.userService.getFriends(id, true);
        const friendList : string[] = await this.userService.makeFriendList(id, friends);
        return { friends: friendList }
    }

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
