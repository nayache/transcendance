import { HttpException, HttpStatus } from "@nestjs/common";
import { AboutErr, TypeErr } from "../enums/error_constants";
import { Error } from "./error.interface";

export class InvalidTokenException extends HttpException {
    constructor(token: string) {
        const type = (token) ? TypeErr.UPDATED : TypeErr.EXPIRED;
        const message = (token) ? 'token is updated' : 'token is expired';
      if (token)
        super({error: new Error(AboutErr.TOKEN, type, message), token: token}, HttpStatus.UNAUTHORIZED);
      else
        super({error: new Error(AboutErr.TOKEN, type, message)}, HttpStatus.UNAUTHORIZED);
    }
  }