import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/user.entity';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from '../enums/error_constants';
@Controller('users/block')
export class BlockedController {
        constructor(private userService: UserService) {}

        @Post('/:pseudo')
        async blockUser(@User() userId: string, @Param('pseudo') pseudo: string)
        {
                const target: UserEntity = await this.userService.findByPseudo(pseudo);
                if (!target)
                        throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'pseudo not found');
                if (userId == target.id)
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID,'Cannot block himself');
                if (await this.userService.blockExist(userId, target.id))
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.INVALID, 'This user is already blocked');
                await this.userService.create_block(userId, target.id);
				return {};
        }

        @Delete('/:pseudo')
        async unblockUser(@User() userId: string, @Param('pseudo') pseudo?: string)
        {
                const target: UserEntity = await this.userService.findByPseudo(pseudo);
                if (!target)
                        throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND, 'pseudo not found');
                if (!await this.userService.blockandauthorExist(userId, target.id))
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.NOT_FOUND, 'Blockship does not exist or User is not the creator of Block');
                await this.userService.deleteBlock(userId, target.id);
				return {};
        }

        @Get('')
        async getBlocked(@User() userId: string)
        {
                return this.userService.getBlock(userId);
        }
}
