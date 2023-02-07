import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtDecoding implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('==========in Middleware==========')
      const userId: string = await this.authService.jwtVerif(req.headers.authorization); 
      req.user = userId;
      console.log('==========out Middleware==========')
      next();
  }
}