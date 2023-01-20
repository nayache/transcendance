import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService) {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('==========in Middleware==========')
    
    const authHeader = req.headers.authorization;
    if (authHeader && (authHeader as string).split(' ')[1]) {
      const token = (authHeader as string).split(' ')[1];
      const decoded = this.authService.decodeJwt(token);
      // je narrive pas a decoder jwt besoin de re sign in luser pour generer un nouveau
      if (!decoded) {
        throw new InvalidTokenException(null);
      }
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new HttpException({ message: 'User not found', token: null }, HttpStatus.UNAUTHORIZED)
      }
      ////=============== 42 oauth check ===========================
      if (this.authService.tokenIsExpire(decoded.expire)) {
        const newToken = await this.authService.updateToken(decoded.refresh_token)
        if (!newToken) {
            // front doit delete token du local storage et inviter luser a se re signin
            throw new InvalidTokenException(null);
        }
        //retourne 401 avec nouveau jwt token
        throw new InvalidTokenException(this.authService.generateJwt(user.id, newToken));
      }
      else if (this.authService.tokenIsExpiring(decoded.exp)) {
        console.log('decoded:', decoded)
        throw new InvalidTokenException(this.authService.generateJwt(user.id, decoded.token));
      }
      //=============================================================
      req.user = user.id;
      next();
      console.log('==========O U T Middleware=======')
    } else {
        throw new HttpException('Error header authorization', HttpStatus.BAD_REQUEST)
    }
  }
}