import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataUserEntity } from 'src/entity/data-user.entity';
import { FriendEntity } from 'src/entity/friend.entity';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { Avatar } from 'src/entity/avatar.entity';
import { AvatarService } from './avatar.service';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity) private friendRepository: Repository<FriendEntity>,
    @InjectRepository(DataUserEntity) private dataUserRepository: Repository<DataUserEntity>,
	private readonly avatarService: AvatarService) {}
    
    async saveUser(login: string) {
        const user : UserEntity = await this.userRepository.save(new UserEntity(login))
        await this.dataUserRepository.save(new DataUserEntity(user));
        return user
    }
    
    async findById(id: string) {
        return this.userRepository.findOneBy({id: id});
    }

    async findByLogin(login: string) {
        return this.userRepository.findOneBy({login: login});
    }

    isValidPseudo(pseudo: string) : boolean {
        console.log('in validpseudo()',pseudo)
        return (pseudo.length > 3 && pseudo.length < 25);
    }

    async pseudoExist(pseudo: string): Promise<boolean> {
        return this.userRepository.exist({ where: {pseudo: pseudo}});
    }

    async addPseudo(id: string, pseudo: string) {
        const user = await this.findById(id);
        if (user.pseudo && await this.pseudoExist(pseudo))
            return null;
       
        return this.userRepository.update(id ,{pseudo: pseudo})
    }

    async updateTwoFa(id: string, value: boolean) {
        return this.userRepository.update(id, {twoFaEnabled: value});
    }

    async updateTwoFaSecret(id: string, value: string) {
        return this.userRepository.update(id, { TwoFaSecret: value });
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
        return this.userRepository.find();
    }
    
    async removeUser(login: string) {
        const user = await this.findByLogin(login);
        return this.userRepository.delete(user.id);
    }

    async createFriendship(userId: string, userId2: string) {
        // je creer le friend entity avec le premier id inferieur au second pour eviter doublon
        const user1 : UserEntity = (userId < userId2) ? await this.findById(userId) : await this.findById(userId2);
        const user2 : UserEntity = (user1.id == userId) ? await this.findById(userId2) : await this.findById(userId);
        return this.friendRepository.save(new FriendEntity(user1, user2));
    }

    async removeFriendship(userId: string, userId2: string) {
        try {
            const friendshipId = await this.friendRepository.find({where: [
                {user1Id: userId, user2Id: userId2},
                {user1Id: userId2, user2Id: userId}
            ]})
            console.log("friendship find: ", friendshipId);
            return await this.friendRepository.remove(friendshipId);
        }
        catch(err) {
            throw new HttpException('data not found or database error', HttpStatus.NOT_FOUND);
        }
    }

    async friendshipExist(userId: string, userId2: string) : Promise<boolean> {
        console.log(userId, userId2)
        return this.friendRepository.exist({where: [
            {user1Id: userId , user2Id: userId2},
            {user1Id: userId2, user2Id: userId}
        ]});
    }

    async makeFriendList(userId: string, friends: FriendEntity[]) : Promise<string[]> {
        let friendList : string[] = friends.map((friend) => {
          return (friend.user1Id == userId) ? friend.user2Id : friend.user1Id;
        })
        
        friendList = await Promise.all( friendList.map(async (id) => {
            const user = await this.findById(id)
            return user.pseudo
        }))
        return friendList;
    }

    async getFriends(userId: string) : Promise<FriendEntity[]> {
        try {
            const friends : FriendEntity[] = await this.friendRepository.find({where: [
                {user1Id: userId},
                {user2Id: userId}
            ]});
            return friends;
        } catch (e) {
            throw new HttpException('data not found', HttpStatus.NOT_FOUND);
        }
    }

	async getUser(id: string): Promise<UserEntity> {
		let user = null;
		if (id) user = await this.userRepository.findOneBy({id: id});
	
		if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
	
		return user;
	  }

	async setAvatar(userId: string, file?: Express.Multer.File): Promise<void> {
        console.log("file dans userService = ", file)
		if (!file)
		  throw new HttpException('File required', HttpStatus.NOT_ACCEPTABLE);
		
		const filename = file.originalname;
		const datafile = file.buffer;
		if (await this.avatarService.exist(userId, filename))
			throw new HttpException('Avatar Filename is already in database for this user', HttpStatus.CONFLICT);
		
		const user: UserEntity = await this.getUser(userId);
		const curr_avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		await this.avatarService.createAvatar(filename, datafile, user);
		if (curr_avatar)
			await this.avatarService.disabled(curr_avatar.id);
		//if (user.avatar) await this.avatarService.deleteAvatar(user.avatar.id);
	  }
	
	async getAvatar(userId: string): Promise<Avatar> {
		//const user: UserEntity = await this.getUser(userId);
		const avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		//console.log(avatar)
		if (!avatar)
		  throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
		return avatar;
	  }
}
