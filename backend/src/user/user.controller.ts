import { Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Request } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('pseudo')
    getPseudo(@User() user: UserEntity) {
        const pseudo = this.userService.getPseudoByLogin(user.login)
        if (!pseudo)
            throw new HttpException('pseudo not found', HttpStatus.BAD_REQUEST)
        
        return { pseudo: pseudo }
    }

    @Post('pseudo')
    savePseudo(@User() user: UserEntity, @Query('pseudo') pseudo: string) {
        //console.log('param: ', user) 
        
        if (!this.userService.isValidPseudo(pseudo))
            throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)    
        

        if (!this.userService.addPseudo(user.login, pseudo))
            throw new HttpException('pseudo already used by other user', HttpStatus.CONFLICT)

        return { statuscode: "201", pseudo: pseudo }
    }

    //just for test
    @Get('list')
    getAll() {
        return this.userService.getUsers()
    }
}
