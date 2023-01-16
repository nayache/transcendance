import { LoggerOptions } from "typeorm"
import { TokenFtEntity } from "./tokenFt.entitiy"

export class UserEntity {

    constructor(login: string, tokenft: TokenFtEntity) {
        this.login = login;
        this.tokenft = tokenft;
    }

    login: string
    pseudo: string
    tokenft: TokenFtEntity
}