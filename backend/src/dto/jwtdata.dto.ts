export class JwtDataDto {
    JwtRefresh: string; 
    userId: string;
    accessToken: string;
    refreshToken: string;
    expire: number;
}