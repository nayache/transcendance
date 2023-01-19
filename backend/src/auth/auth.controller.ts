import { Controller, Get, HttpException, HttpStatus, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/entity/user.entity';

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService,
    private readonly userService: UserService) {}
    
    @Get()
    async auth(@Query('code') code: string) {
        // penser a bien gerer error data
        console.log('\x1b[33min auth controller <--\x1b[0m')
        const tokenft = await this.authService.generateToken(code);
        if (!tokenft) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        const login = await this.authService.getLoginFrom42(tokenft.access_token)
        if (!login) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        const user = this.userService.saveUser(login, tokenft);
        const jwt = this.authService.generateJwt(user);
        
        console.log('jwt generate ----> [', jwt, ']')

        return { "token" : jwt }
    }
    //just for test
    @Get('refresh')
    async refresh(@User() user: UserEntity) {
        const token = await this.authService.updateToken(user.tokenft.refresh_token)
        if (!token) {
            console.log('fail after refresh')
            throw new HttpException('refreshing fail', HttpStatus.UNAUTHORIZED)
        }
        console.log('--------=-=-=-=-> refresh: ', token);
        this.userService.saveUser(user.login, token);
        return token
    }

    //just for test
    @Get('getlog')
    async getlog(@User() user: UserEntity) {
        const log = await this.authService.getLoginFrom42(user.tokenft.access_token);
        if (!log)
            throw new UnauthorizedException()
        return log
    }

}
