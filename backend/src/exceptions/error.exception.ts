import { HttpException, HttpStatus } from "@nestjs/common";
import { Error } from "./error.interface";

export class ErrorException extends HttpException {
    constructor(status: HttpStatus, about: string, type: string, message?: string) {
        const error = new Error(about, type, message);
        super({error: error}, status);
    }
  }