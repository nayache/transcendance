import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
    
    async saveUser(login: string) {
        return await this.userRepository.save(new UserEntity(login))
    }
    
    async findById(id: string) {
        return await this.userRepository.findOneBy({id: id});
    }

    async findByLogin(login: string) {
        return await this.userRepository.findOneBy({login: login});
    }

    isValidPseudo(pseudo: string) : boolean {
        console.log('in validpseudo()',pseudo)
        return (pseudo.length > 3 && pseudo.length < 25);
    }

    async pseudoExist(pseudo: string): Promise<boolean> {
        return await this.userRepository.exist({ where: {pseudo: pseudo}});
    }

    async addPseudo(id: string, pseudo: string) {
        const user = await this.findById(id);
        if (user.pseudo && await this.pseudoExist(pseudo))
            return null;
       
        return await this.userRepository.update(id ,{pseudo: pseudo})
    }

    async updateTwoFa(id: string, value: boolean) {
        return await this.userRepository.update(id, {twoFaEnabled: value});
    }

    async updateTwoFaSecret(id: string, value: string) {
        return await this.userRepository.update(id, { TwoFaSecret: value });
    }

    async getTwoFaSecret(id: string) {
        const user = await this.findById(id);
        return user.TwoFaSecret;
    }

    async getPseudoById(id: string) : Promise<string> {
        const user = await this.findById(id);
        if (user && user.pseudo) {
            return user.pseudo;
        }
        return null;
    }

    async getUsers() : Promise<UserEntity[]> {
        return await this.userRepository.find();
    }
}
