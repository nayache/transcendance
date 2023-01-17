import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService,
    private readonly userService: UserService) {}
    
    @Get()
    async auth(@Query('code') code: string) {
        // penser a bien gerer error data
        //console.log('\x1b[33min auth controller <--\x1b[0m')
        const tokenft = await this.authService.authentification(code);
        if (tokenft === null) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        const login = await this.authService.getLoginFrom42(tokenft.access_token)
        if (login === null) {
            return new HttpException('Error Authentification', HttpStatus.UNAUTHORIZED);
        }
        this.userService.saveUser(login, tokenft);
        const jwt = this.authService.generateJwt(login, tokenft)
//        console.log('jwt generate ----> [', jwt, ']')
        return jwt
    }
}
