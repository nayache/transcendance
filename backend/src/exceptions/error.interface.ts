import { IsEmpty, IsNotEmpty } from "class-validator";
import { AboutErr } from '../enums/error_constants'
import { TypeErr } from '../enums/error_constants'

export class Error {
    constructor(about: AboutErr, type: TypeErr, message: string = '') {
        this.about = about;
        this.type = type;
        this.message = message
    }

    @IsNotEmpty()
    about: AboutErr;
    
    @IsNotEmpty()
    type: TypeErr;
   
    @IsEmpty()
    message: string;
}