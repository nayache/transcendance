import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('pseudo')
    async getPseudo(@User() userId: string) {
        const pseudo = await this.userService.getPseudoById(userId)
        if (!pseudo)
            throw new HttpException('pseudo not found', HttpStatus.BAD_REQUEST)
        
        return { pseudo: pseudo }
    }

    @Patch('pseudo')
    async savePseudo(@User() userId: string, @Body('pseudo') pseudo: string) {
        console.log('userId received: ', userId, 'pseudo in param: ', pseudo) 
        
        if (!this.userService.isValidPseudo(pseudo))
            throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)    
        
        if (!await this.userService.addPseudo(userId, pseudo))
            throw new HttpException('pseudo already used by other user', HttpStatus.CONFLICT)

        return { statuscode: "200", pseudo: pseudo }
    }

    @Get()
    async getAll() : Promise<UserEntity[]> {
        return await this.userService.getUsers();
    }
}
