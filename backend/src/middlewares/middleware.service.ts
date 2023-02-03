import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { InvalidTokenException } from "src/exceptions/invalid-token.exception";
import { UserService } from "src/user/user.service";

@Injectable()
export class MiddlewareService {
    constructor(private authService: AuthService, private userService: UserService) {}

    async jwtVerif(token: string): Promise<string> {
        const decoded = this.authService.decodeJwt(token);
        if (!decoded) {
            throw new InvalidTokenException(null);
        }
        const user = await this.userService.findById(decoded.infos.userId);
        if (!user) {
            throw new HttpException({ message: 'User not found', token: null }, HttpStatus.FORBIDDEN)
        }
        if (this.authService.tokenIsExpire(decoded.infos.expire)) {
            const newToken = await this.authService.updateToken(decoded.data.refreshToken)
            if (!newToken) {
                throw new InvalidTokenException(null);
            }
            throw new InvalidTokenException(this.authService.generateJwt(decoded.infos.userId, newToken));
        } 
        else if (this.authService.tokenIsExpiring(decoded.exp)) {
            console.log('jwt expriring.. -> regenerate')
            throw new InvalidTokenException(this.authService.generateJwt(decoded.infos.userId, undefined, decoded.infos));
        }
        return user.id;
    }
}