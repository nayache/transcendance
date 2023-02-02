import { Controller, Delete, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { BlockedService } from './blocked.service';
@Controller('user/block')
export class BlockedController {
	constructor(private userService: UserService,
		private readonly blockedService: BlockedService) {}

	@Post('/:id')
	async blockUser(@User() userId: string, @Param('id') id: string)
	{
		if (userId == id)
			throw new HttpException('Cannot block himself', HttpStatus.BAD_REQUEST);
		if (await this.blockedService.blockExist(userId, id))
			throw new HttpException('This user is already blocked', HttpStatus.CONFLICT);
		return this.blockedService.create_block(userId, id);
	}

	@Delete('/:id')
	async unblockUser(@User() userId: string, @Param('id') id: string)
	{
		if (!await this.blockedService.blockandauthorExist(userId, id))
			throw new HttpException('Blockship does not exist', HttpStatus.BAD_REQUEST);
		return this.blockedService.deleteBlock(userId, id);
	}
}
