import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService,
    private readonly userService: UserService) {}
    
    @Get()
    async auth(@Query('code') code: string) {
        const tokenft = await this.authService.generateToken(code);
        if (!tokenft) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        const login = await this.authService.getLoginFrom42(tokenft.access_token)
        if (!login) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        let user = await this.userService.findByLogin(login);
        if (!user)
            user = await this.userService.saveUser(login);
        const jwt = this.authService.generateJwt(user.id, tokenft);
        
        console.log('jwt generate ----> [', jwt, ']')

        return { "token" : jwt }
    }

    @Post('/2fa')
    async setTwoFa(@User() userId: string, @Query('twofa') value: boolean): Promise<any> {
        try {
            await this.userService.updateTwoFa(userId, value);
        } catch (err) {
            throw new HttpException('updating user in database failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}