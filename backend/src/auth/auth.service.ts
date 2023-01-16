import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

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
        console.log(data)
        if (!data.error)
            this.userService.saveUser(data);

        return (data);
    }       
}
