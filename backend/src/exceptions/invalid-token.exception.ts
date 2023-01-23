import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTokenException extends HttpException {
    constructor(token: string) {
        const message = (token) ? 'token is updated' : 'token is expired';
      super({message: message, token: token}, HttpStatus.FORBIDDEN);
    }
  }