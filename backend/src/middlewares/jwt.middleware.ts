import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth/auth.service';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';

@Injectable()
export class JwtDecoding implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('==========in Middleware==========')
    
    const authHeader = req.headers.authorization;
    if (authHeader && (authHeader as string).split(' ')[1]) {
      const token = (authHeader as string).split(' ')[1];
      const decoded = this.authService.decodeJwt(token);
      if (!decoded) {
        throw new InvalidTokenException(null);
      }
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new HttpException({ message: 'User not found', token: null }, HttpStatus.UNAUTHORIZED)
      }
      res.locals.info = { decoded: decoded, twoFa: user.twoFaEnabled };
      next();
    } else {
        throw new HttpException('Error header authorization', HttpStatus.BAD_REQUEST)
    }
  }
}