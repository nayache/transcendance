import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { JwtService } from '@nestjs/jwt';
import { JwtDataDto } from 'src/dto/jwtdata.dto';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';
import { UserService } from 'src/user/user.service';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from '../enums/error_constants';
import { JwtDecodedDto } from 'src/dto/jwtdecoded.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

    async generateToken(code: string): Promise<TokenFtEntity> | null {
       if (!code) {
            return null;
        }
        const uri = "https://api.intra.42.fr/oauth/token";
          
        console.log('before fetch')
        const response = await fetch(uri, {
            method: 'POST', headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({
            grant_type: "authorization_code", 
            client_id: process.env.CLIENT_ID, 
            client_secret: process.env.CLIENT_SECRET,
            code: code, redirect_uri: "http://localhost:3000/register"
            })})
        console.log('generate 42token response: ', response.status, response.statusText);
        if (response.status != 200)
            return null
        
        return (response.status != 200) ? null : response.json()
    }
    
    async updateToken(refreshToken: string): Promise<TokenFtEntity> | null{
        const uri = "https://api.intra.42.fr/oauth/token";
          
        console.log('before fetch')
        const response = await fetch(uri, {
            method: 'POST', headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({
            grant_type: "refresh_token", 
            refresh_token: refreshToken,
            client_id: process.env.CLIENT_ID, 
            client_secret: process.env.CLIENT_SECRET
        })})
        console.log('updateToken() response: ', response.status, response.statusText);
        
        return (response.status != 200) ? null : response.json()
    } 

    tokenFtIsExpire(expire: number) : boolean {
        return ((Date.now() / 1000) >= expire)
    }

    tokenIsExpiring(expire: number) : boolean {
        return ((Date.now() / 1000) + +process.env.DELAI >= expire);
    }

    getExpire(expire: number): number {
       return ((Date.now() / 1000) + expire);
    }
    
    async checkToken(access_token: string) : Promise<boolean> {
        const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${access_token}` } });
        return (res.status == 200)
    }

    async getLoginFrom42(access_token: string): Promise<string> {
        const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${access_token}` } });
        if (res.status != 200)
            return null
        const data = await res.json();
        return data.login;
    }

    jwtDataToDto(userId: string, payload: TokenFtEntity, refreshJwt: string) : JwtDataDto {
        const expire = this.getExpire(payload.expires_in);
        return {JwtRefresh: refreshJwt, userId: userId, accessToken: payload.access_token, refreshToken: payload.refresh_token, expire: expire};
    }

    decodedToDto(decoded: JwtDecodedDto): JwtDataDto {
        const {iat, exp, ...wanted} = decoded;
        return wanted;
    }

    generateJwtRefresh(): string {
        return this.jwtService.sign({},{expiresIn: '1h'});
    }

    generateJwt(payload: JwtDataDto) : string {
        return this.jwtService.sign(payload); 
    }

    refreshJwt(payload: JwtDecodedDto, refresh: string) : string {
        if (!this.decodeJwt(refresh, true))
            return null;
        else 
            return this.generateJwt(this.decodedToDto(payload));
    }

    decodeJwt(token: string, value: boolean = false) : JwtDecodedDto {
        try {
            const decoded : JwtDecodedDto = this.jwtService.verify(token, {secret: process.env.JWT_SECRET, ignoreExpiration: value});
            return decoded;
        } catch (err) {
            if (err.message == 'jwt expired')
                console.log('decodeJwt(): expired');
            return null
        }
    }

    async refreshPayload(payload: JwtDecodedDto): Promise<JwtDecodedDto> {
        const newToken42 : TokenFtEntity = await this.updateToken(payload.refreshToken);
        if (!newToken42)
            return null;
        payload.accessToken = newToken42.access_token;
        payload.refreshToken = newToken42.refresh_token;
        payload.expire = this.getExpire(newToken42.expires_in);
        return payload;
    }

    authorizationHeader(keyword: string, data: string) : boolean {
        if (data && data.split(' ')[0] === keyword && data.split(' ')[1])
            return true;
        else
            return false;
    }

    async jwtVerif(token: string): Promise<string> {
        if (!this.authorizationHeader('Bearer', token))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, AboutErr.HEADER, TypeErr.INVALID, 'authorization header (bearer) incorrect')
        
        const decoded: JwtDecodedDto = this.decodeJwt(token.split(' ')[1]);
        if (!decoded) {
            throw new InvalidTokenException(TypeErr.EXPIRED);
        }
        if (this.tokenFtIsExpire(decoded.expire)) {
            console.log('token ft is expire')
            throw new InvalidTokenException(TypeErr.EXPIRED);
        }
        const user = await this.userService.findById(decoded.userId);
        if (!user) {
            throw new ErrorException(HttpStatus.FORBIDDEN, AboutErr.USER, TypeErr.NOT_FOUND, 'token not associated with an user');
        }
        return user.id;
    }
}
