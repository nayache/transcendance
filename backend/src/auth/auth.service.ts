import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { JwtService } from '@nestjs/jwt';
import { JwtDataDto } from 'src/dto/jwtdata.dto';
import { InvalidTokenException } from 'src/exceptions/invalid-token.exception';
import { UserService } from 'src/user/user.service';
import { ErrorException } from 'src/exceptions/error.exception';

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

    tokenIsExpire(expire: number) : boolean {
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

    generateJwt(id: string, token?: TokenFtEntity, data?: JwtDataDto) : string {
        let payload : any;
        if (token) {
            const expire = this.getExpire(token.expires_in);
            payload = { infos: { userId: id, accessToken: token.access_token, refreshToken: token.refresh_token, expire: expire }};
        }
        else {
            payload = { infos: { userId: id, accessToken: data.accessToken, refreshToken: data.refreshToken, expire: data.expire }};
        }
        return this.jwtService.sign(payload); 
    }

    decodeJwt(token: string) {
        try {
            const decoded = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
            return decoded;
        } catch (err) {
            if (err.message == 'jwt expired')
                console.log('expired');
            return null
        }
    }

    authorizationBearerHeader(data: string) : boolean {
        if (data && data.split(' ')[0] === 'Bearer' && data.split(' ')[1])
            return true;
        else
            return false;
    }

    async jwtVerif(token: string): Promise<string> {
        if (!this.authorizationBearerHeader(token))
            throw new ErrorException(HttpStatus.UNAUTHORIZED, 'header', 'invalid', 'authorization header (bearer) incorrect')
        
        const decoded = this.decodeJwt(token.split(' ')[1]);
        if (!decoded) {
            throw new InvalidTokenException(null);
        }
        const user = await this.userService.findById(decoded.infos.userId);
        if (!user) {
            throw new ErrorException(HttpStatus.FORBIDDEN, 'user', 'not_found', 'token not associated with an user');
        }
        if (this.tokenIsExpire(decoded.infos.expire)) {
            const newToken = await this.updateToken(decoded.data.refreshToken)
            if (!newToken) {
                throw new InvalidTokenException(null);
               // throw new InvalidTokenException(null);
            }
            throw new InvalidTokenException(this.generateJwt(decoded.infos.userId, newToken));
        } 
        else if (this.tokenIsExpiring(decoded.exp)) {
            console.log('jwt expriring.. -> regenerate')
            throw new InvalidTokenException(this.generateJwt(decoded.infos.userId, undefined, decoded.infos));
        }
        return user.id;
    }
}
