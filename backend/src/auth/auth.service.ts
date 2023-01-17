import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async authentification(code: string): Promise<any> | null {
       if (!code) {
            return null;
        }
        const uri = "https://api.intra.42.fr/oauth/token";
          
        console.log('before fetch')
        try {
            const response = await fetch(uri, {
            method: 'POST', headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({
            grant_type: "authorization_code", 
            client_id: process.env.CLIENT_ID, 
            client_secret: process.env.CLIENT_SECRET,
            code: code, redirect_uri: "http://localhost:3000/register"
            })})
            return response.json()
        }
        catch(err) {
            return null
        }
    }
   
    async getLoginFrom42(access_token: string): Promise<string> {
        try {
            const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${access_token}` } });
            const data = await res.json();
            return data.login;
        }
        catch (err) {
            throw new BadRequestException();
        }
    }
    
    generateJwt(login: string, tokenft: TokenFtEntity) {
        const payload = { login, tokenft };
        return this.jwtService.sign(payload);
    }
}
