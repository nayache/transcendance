import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtDecoding implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('==========in Middleware==========')
    const url: string = req.method + req.originalUrl;
    const wantedPseudo: boolean = (url === 'GET/user/pseudo' || url === 'POST/user') ? false : true;
    const userId: string = await this.authService.jwtVerif(req.headers.authorization, wantedPseudo);
    req.user = userId;
    console.log('==========out Middleware==========')
    next();
  }
}
