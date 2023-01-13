import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthService {
    constructor(private readonly appService: AppService) {}

    async authentification(code: string) {
       if (!code) {
            throw new HttpException('Code is empty', HttpStatus.BAD_REQUEST)
        }
    
        const uri = "https://api.intra.42.fr/oauth/token";
          
        const response = await fetch(uri, {
            method: 'POST', headers: {
            'Content-Type': 'application/json'}, body: JSON.stringify({
            grant_type: "authorization_code", 
            client_id: process.env.CLIENT_ID, 
            client_secret: process.env.CLIENT_SECRET,
            code: code, redirect_uri: "http://localhost:3000/register"})})
        const data = await response.json()
        if (!data.error) {
            const token: string = data.access_token;
            this.appService.sayHello(token)
        }       
        return (data); 
    }
}
