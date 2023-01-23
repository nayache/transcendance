import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class GoogleAuth implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void) {
        console.log('=======in google auth MIDDLEWARE========')
        const info = req.body;
        if (info.twoFa == true) {
           // IMPLEMENTS GOOGLE AUTH 
        }
        req.user = info.id;
        next();
    }
}