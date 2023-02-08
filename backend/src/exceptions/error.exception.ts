import { HttpException, HttpStatus } from "@nestjs/common";
import { AboutErr, TypeErr } from "../enums/error_constants";
import { Error } from "./error.interface";

export class ErrorException extends HttpException {
    constructor(status: HttpStatus, about: AboutErr, type: TypeErr, message?: string) {
        const error = new Error(about, type, message);
        super({error: error}, status);
    }
  }