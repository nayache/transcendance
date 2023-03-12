import { Controller, Delete, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/user.entity';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from '../enums/error_constants';
@Controller('user/block')
export class BlockedController {
        constructor(private userService: UserService) {}

        @Post('/:pseudo')
        async blockUser(@User() userId: string, @Param('pseudo') pseudo?: string)
        {
                const target: UserEntity = await this.userService.findByPseudo(pseudo);
                if (!target)
                        throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'pseudo not found');
                if (userId == target.id)
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.INVALID,'Cannot block himself');
                if (await this.userService.blockExist(userId, target.id))
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.INVALID, 'This user is already blocked');
                return this.userService.create_block(userId, target.id);
        }

        @Delete('/:pseudo')
        async unblockUser(@User() userId: string, @Param('pseudo') pseudo?: string)
        {
                const target: UserEntity = await this.userService.findByPseudo(pseudo);
                if (!target)
                        throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'pseudo not found');
                if (!await this.userService.blockandauthorExist(userId, target.id))
                        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.NOT_FOUND, 'Blockship does not exist or User is not the creator of Block');
                return this.userService.deleteBlock(userId, target.id);
        }

        @Get('')
        async getBlocked(@User() userId: string)
        {
                return this.userService.getBlock(userId);
        }
}
