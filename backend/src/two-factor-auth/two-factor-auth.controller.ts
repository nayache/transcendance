import { Controller, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { toDataURL } from 'qrcode'
import { UserService } from 'src/user/user.service';

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
        private readonly userService: UserService
    ) {}

    @Post('generate')
    async generate(@User() userId: string) : Promise<string> {
        const { otpAuthUrl } = await this.twoFactorAuthService.generateSecret(userId);
        return toDataURL(otpAuthUrl);
    }

    @Post('auth')
    async authentification(@User() userId: string, @Query('code') code) {
        const isValid : boolean = await this.twoFactorAuthService.verifCode(userId, code);
        if (!isValid)
            throw new HttpException('2fa code invalid', HttpStatus.UNAUTHORIZED);
        else
            return "2FA AUTH ACCESS VALIDATED"
    }

    @Post('turn')
    async enableOrDisableTwoFa(@User() userId: string, @Query('value') value: boolean) {
        await this.userService.updateTwoFa(userId, value);
    }
}
