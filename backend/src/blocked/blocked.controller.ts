import { Controller, Delete, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
@Controller('user/block')
export class BlockedController {
	constructor(private userService: UserService) {}

	@Post('/:id')
	async blockUser(@User() userId: string, @Param('id') id: string)
	{
		if (userId == id)
			throw new HttpException('Cannot block himself', HttpStatus.BAD_REQUEST);
		if (await this.userService.blockExist(userId, id))
			throw new HttpException('This user is already blocked', HttpStatus.CONFLICT);
		return this.userService.create_block(userId, id);
	}

	@Delete('/:id')
	async unblockUser(@User() userId: string, @Param('id') id: string)
	{
		if (!await this.userService.blockandauthorExist(userId, id))
			throw new HttpException('Blockship does not exist', HttpStatus.BAD_REQUEST);
		return this.userService.deleteBlock(userId, id);
	}
}
