export class JwtDecodedDto {
    JwtRefresh: string; 
    userId: string;
    accessToken: string;
    refreshToken: string;
    expire: number;
    iat: number;
    exp: number;
}