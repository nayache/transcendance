import { Injectable } from '@nestjs/common';
import e from 'express';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class UserService {
    
    private readonly users: UserEntity[] = [];
    
    saveUser(login: string, tokenft: TokenFtEntity): UserEntity {
        // si login existe je modifie le token par le nouveau
        // sinon jadd user
        const user = this.users.find(elem => elem.login == login)
        if (!user) {
            this.users.push(new UserEntity(login, tokenft, tokenft.expires_in));
            return this.users.find(elem => elem.login == login);
        }
        else {
            user.tokenft = tokenft;
            user.setExpire(tokenft.expires_in);
            return user;
        }
        ///LE CAS OU USER EXIST DEJA A VOIR SI FRONT  DESACTIVE BOUTTON
    }
    
    findByLogin(login: string) {
        return this.users.find(elem => elem.login == login);
    }

    isValidPseudo(pseudo: string) : boolean {
        return (pseudo.length > 3 && pseudo.length < 25);
    }

    checkAuthenticityPseudo(pseudo: string): boolean {
        return (this.users.find(elem => elem.pseudo == pseudo)) === undefined ? true : false;
    }

    addPseudo(login: string, pseudo: string) {
        const user = this.findByLogin(login)
        if (user.pseudo && !this.checkAuthenticityPseudo(pseudo))
            return null;
        
        user.pseudo = pseudo;
        return user;
    }

    getPseudoByLogin(login: string) : string {
        return this.users.find(elem => elem.login === login).pseudo;
    }

    getUsers() : UserEntity[] {
        return this.users;
    }
}
