import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorDto } from "src/dto/error.dto";
import { AboutErr, TypeErr } from "../enums/error_constants";
import { Error } from "./error.interface";

export class InvalidTokenException extends HttpException {
    constructor(type: TypeErr) {
        const message = (type == TypeErr.EXPIRED) ? 'token is expired' : 'token cant be refreshed';
        const error : Error = new Error(AboutErr.TOKEN, type, message);
        super(new ErrorDto(error), HttpStatus.UNAUTHORIZED);
    }
  }