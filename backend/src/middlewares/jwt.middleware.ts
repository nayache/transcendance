import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { MiddlewareService } from './middleware.service';

@Injectable()
export class JwtDecoding implements NestMiddleware {
  constructor(private middlewareService: MiddlewareService) {}

  async use(req: Request, res: Response, next: () => void) {
    console.log('==========in Middleware==========')
    const authHeader = req.headers.authorization;
    if (authHeader && (authHeader as string).split(' ')[1]) {
      const token = (authHeader as string).split(' ')[1];
      const userId: string = await this.middlewareService.jwtVerif(token); 
      req.user = userId;
    console.log('==========out Middleware==========')
      next();
    } else {
        throw new HttpException('Error header authorization', HttpStatus.UNAUTHORIZED)
    }
  }
}