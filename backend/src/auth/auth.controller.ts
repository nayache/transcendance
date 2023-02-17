import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/decorators/user.decorator';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { JwtDecodedDto } from 'src/dto/jwtdecoded.dto';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';
import { UserEntity } from 'src/entity/user.entity';
import { IsNotEmpty, IsOptional, isString, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidationFilter } from 'src/chat/validation-filter';
import { toDataURL } from 'qrcode'

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    @IsOptional()
    digit?: string
}

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService,
    private readonly userService: UserService) {}
    
    @UsePipes(ValidationPipe)
    @UseFilters(ValidationFilter)
    @Post()
    async auth(@Body() payload: AuthDto) {
        const tokenft = await this.authService.generateToken(payload.code);
        if (!tokenft) {
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.TOKEN, TypeErr.INVALID, 'auth code is invalid');
        }
        const login = await this.authService.getLoginFrom42(tokenft.access_token);
        if (!login) {
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.TOKEN, TypeErr.REJECTED, 'cannot acces login user');
        }
        let user: UserEntity = await this.userService.findByLogin(login);
        if (!user)
            user = await this.userService.saveUser(login);
        if (!await this.authService.twoFaAccess(user.twoFaEnabled, user.id, payload.digit))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.TWOFA, TypeErr.REJECTED, '2fa digit is invalid');
        const refresh : string = this.authService.generateJwtRefresh();
        const token : string = this.authService.generateJwt(this.authService.jwtDataToDto(user.id, tokenft, refresh));
        
        console.log(`jwt generate ----> [ ${token} ]`);

        return { token };
    }

    @Get('token')
    async refresh(@Headers('authorization') data: string) {
        if (!this.authService.authorizationHeader('Refresh', data))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.HEADER, TypeErr.INVALID, 'authorization header (refresh) incorrect')
        
        let decoded: JwtDecodedDto = this.authService.decodeJwt(data.split(' ')[1], true);
        if (!decoded)
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.TOKEN, TypeErr.INVALID, 'invalid token provides');
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

    @Get('2fa')
    async isTwoFaActivated(@User() userId: string) {
        const user: UserEntity = await this.userService.findById(userId);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
        return {enabled: user.twoFaEnabled};
    }

    @Post('2fa')
    async enableOrDisableTwoFa(@User() userId: string, @Body('toggle') value: boolean) {
        if (value === undefined || typeof(value) != 'boolean')
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.REQUEST, TypeErr.INVALID);
        await this.userService.updateTwoFa(userId, value);
    }
    
    @Get('2fa/generate')
    async generate(@User() userId: string) : Promise<string> {
        const { otpAuthUrl } = await this.authService.generateSecret(userId);
        return toDataURL(otpAuthUrl);
    }

    @Post('auth')
    async authentification(@User() userId: string, @Body('code') code: string) {
        if (!code)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.REQUEST, TypeErr.EMPTY);
        const isValid : boolean = await this.authService.verifDigit(userId, code);
        if (!isValid)
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.TWOFA, TypeErr.REJECTED, '2fa code invalid');
        else
            return "2FA AUTH ACCESS VALIDATED"
    }
}