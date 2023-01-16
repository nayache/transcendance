import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class UserService {
    constructor(private jwtService: JwtService) {}
    
    private readonly users: UserEntity[] = [];
    
    async getLoginFrom42(access_token: string): Promise<string> {
        try {
            const res = await fetch('https://api.intra.42.fr/v2/me', { headers: { 'Authorization': `Bearer ${access_token}` } });
            const data = await res.json();
            return data.login;
        } catch (err) {
            throw new BadRequestException();
        }
    }

    async saveUser(tokenft: TokenFtEntity) {
        const login = await this.getLoginFrom42(tokenft.access_token);
        
        // si login existe je modifie le token par le nouveau
        // sinon jadd user
        
        const user = this.users.find(elem => elem.login == login)
        if (user === undefined)
            this.users.push(new UserEntity(login, tokenft));
        else
            user.tokenft = tokenft;
        
        //GENERATION JWT TOKEN
        const payload = { login, tokenft }; // le JWT token comportera le login et lobjet token 42
        const jwt = this.jwtService.sign(payload);
        console.log(jwt);
    }
    
    checkAuthenticityPseudo(pseudo: string): boolean {
        return (this.users.find(elem => elem.pseudo == pseudo)) === undefined ? false : true
    }

    addPseudo(pseudo: string) {
        ///
    }

    getUsers() : UserEntity[] {
        return this.users
    }
}
