import { Controller, Get, Headers, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/decorators/user.decorator';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { JwtDecodedDto } from 'src/dto/jwtdecoded.dto';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';

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
        const refresh : string = this.authService.generateJwtRefresh();
        const jwt : string = this.authService.generateJwt(this.authService.jwtDataToDto(user.id, tokenft, refresh));
        
        console.log(`jwt generate ----> [ ${jwt} ]`);

        return { token : jwt };
    }

    @Get('token')
    async refresh(@Headers('authorization') data: string) {
        if (!this.authService.authorizationHeader('Refresh', data))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.HEADER, TypeErr.INVALID, 'authorization header (refresh) incorrect')
        
        let decoded: JwtDecodedDto = this.authService.decodeJwt(data.split(' ')[1], true);
        if (this.authService.tokenFtIsExpire(decoded.expire)) {
            decoded = await this.authService.refreshPayload(decoded);
            if (!decoded)
                throw new InvalidTokenException(TypeErr.TIMEOUT);
        }
        const newJwtToken : string = this.authService.refreshJwt(decoded, decoded.JwtRefresh);
        if (!newJwtToken)
            throw new InvalidTokenException(TypeErr.TIMEOUT);
        
        console.log(`jwt refreshing ----> [ ${newJwtToken} ]`);
        
        return { token: newJwtToken };
    }

    @Get('/verify')
    verify() {
        return {};
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