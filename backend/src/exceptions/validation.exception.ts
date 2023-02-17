import { HttpException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { ErrorDto } from "src/dto/error.dto";
import { AboutErr, TypeErr } from "src/enums/error_constants";
import { Error } from "./error.interface";

export class ValidationException extends HttpException {
    constructor(errors: ValidationError[]) {
        const message: string = Object.values(errors[0].constraints)[0];
        const error : ErrorDto = new ErrorDto(new Error(AboutErr.REQUEST, TypeErr.INVALID, message));
        super(error, 400);
    }
}