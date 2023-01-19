import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

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
       /* console.log('date now    : ', Date.now() / 1000)
        console.log('delai       : ', +process.env.DELAI)
        console.log('date + delai: ', Date.now() / 1000 + +process.env.DELAI)
        console.log('expire      : ', expire)*/
        return ((Date.now() / 1000) + +process.env.DELAI >= expire);
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
    
    generateJwt(user: UserEntity) : string {
        const payload = { user };
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
}
