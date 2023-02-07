import { HttpException, HttpStatus } from "@nestjs/common";
import { Error } from "./error.interface";

export class InvalidTokenException extends HttpException {
    constructor(token: string) {
        const type = (token) ? 'updated' : 'expired';
        const message = (token) ? 'token is updated' : 'token is expired';
      if (token)
        super({error: new Error('token', type, message), token: token}, HttpStatus.UNAUTHORIZED);
      else
        super({error: new Error('token', type, message)}, HttpStatus.UNAUTHORIZED);
    }
  }