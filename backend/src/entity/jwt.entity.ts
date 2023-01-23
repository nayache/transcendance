import { TokenFtEntity } from "./tokenFt.entitiy"

export class JwtEntity {
    id: string
    tokenft: TokenFtEntity
    expire: number
}