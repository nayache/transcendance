import { WsException } from "@nestjs/websockets";
import { ErrorDto } from "src/dto/error.dto";
import { AboutErr, TypeErr } from "src/enums/error_constants";
import { Error } from "./error.interface";

export class WsChatError extends WsException {
    constructor(about: AboutErr, type: TypeErr, message?: string) {
        const error : ErrorDto = new ErrorDto(new Error(about, type, message));
        super(error);
    }
}