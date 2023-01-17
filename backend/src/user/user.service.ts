import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class UserService {
    
    private readonly users: UserEntity[] = [];
    
    saveUser(login: string, tokenft: TokenFtEntity) {
        
        // si login existe je modifie le token par le nouveau
        // sinon jadd user
        
        const user = this.users.find(elem => elem.login == login)
        if (user === undefined)
            this.users.push(new UserEntity(login, tokenft));
        else
            user.tokenft = tokenft;
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
