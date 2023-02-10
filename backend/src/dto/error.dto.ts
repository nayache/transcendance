import { Error } from "src/exceptions/error.interface";

export class ErrorDto {
    constructor(error: Error) {
        this.error = error;
    }
    error: Error
}