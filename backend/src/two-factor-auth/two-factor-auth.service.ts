import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFactorAuthService {
    constructor(private readonly userService: UserService) {}

    async generateSecret(userId: string) {
        console.log('APP_NAME =', process.env.APP_NAME);
        const pseudo = await this.userService.getPseudoById(userId);
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(
            pseudo,
            process.env.APP_NAME,
            secret
        );

        await this.userService.updateTwoFaSecret(userId, secret);
        return {
            secret,
            otpAuthUrl
        };
    }
    
    async verifCode(userId: string, code: string) : Promise<boolean> {
        const secret = await this.userService.getTwoFaSecret(userId);
        return authenticator.verify({ token: code, secret: secret });
    }
}
