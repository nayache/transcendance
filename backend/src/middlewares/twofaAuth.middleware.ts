import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class TwoFaAuth implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void) {
        const info = res.locals.info;
        if (info.twoFa == true) {
            console.log('TWOFA IS ENABLED')
        }
        req.user = info.id;
        console.log('====Out 2fa MIDDLEWARE====')
        next();
    }
}