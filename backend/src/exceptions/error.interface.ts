import { IsEmpty, IsNotEmpty } from "class-validator";

export class Error {
    constructor(about: string, type: string, message: string = '') {
        this.about = about;
        this.type = type;
        this.message = message
    }

    @IsNotEmpty()
    about: string;
    
    @IsNotEmpty()
    type: string;
   
    @IsEmpty()
    message: string;
}