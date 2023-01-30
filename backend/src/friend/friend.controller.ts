import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';

@Controller('user/friend')
export class FriendController {
    constructor(private userService: UserService) {}

    @Post('/:id')
    async makeFriend(@User() userId: string, @Param('id') id: string) {
        if (await this.userService.friendshipExist(userId, id))
            throw new HttpException('already friend', HttpStatus.BAD_REQUEST);
        else
            return this.userService.createFriendship(userId, id);
    }

    @Delete('/:id')
    async deleteFriend(@User() userId: string, @Param('id') id: string) {
        if (!await this.userService.friendshipExist(userId, id))
            throw new HttpException('friendship not exist', HttpStatus.BAD_REQUEST);
        else
            return this.userService.removeFriendship(userId, id);
    }

    @Get()
    async getFriendList(@User() userId: string) {
        const friends = await this.userService.getFriends(userId);
        const friendList : string[] = await this.userService.makeFriendList(userId, friends);
        return { friends: friendList }
    }

}
