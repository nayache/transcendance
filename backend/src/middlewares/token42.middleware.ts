import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { InvalidTokenException } from "src/exceptions/invalid-token.exception";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class TokenFtVerify implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        
        const info = req.body;
       // console.log('decoded: ', decoded);
        if (this.authService.tokenIsExpire(info.decoded.expire)) {
            const newToken = await this.authService.updateToken(info.decoded.refresh_token)
            if (!newToken) {
                throw new InvalidTokenException(null);
            }
            throw new InvalidTokenException(this.authService.generateJwt(info.decoded.id, newToken));
        } 
        else if (this.authService.tokenIsExpiring(info.decoded.exp)) {
            console.log('jwt expriring.. -> regenerate')
            throw new InvalidTokenException(this.authService.generateJwt(info.decoded.id, info.decoded.token));
        }
        console.log('==========O U T Middleware=======')
        req.body = { id: info.decoded.id, twoFa: info.twoFa };
        next();
    }
}