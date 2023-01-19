import { ExistingProvider } from "@nestjs/common";
import { TokenFtEntity } from "./tokenFt.entitiy"

export class UserEntity {

    constructor(login: string, tokenft: TokenFtEntity, expire: number) {
        this.login = login;
        this.tokenft = tokenft;
        this.setExpire(expire);
    }

    login: string
    pseudo: string
    tokenft: TokenFtEntity
    expire: number

    setExpire(expire: number) {
        this.expire = (Date.now() / 1000) + expire
    }
}