import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataUserEntity } from 'src/entity/data-user.entity';
import { FriendEntity } from 'src/entity/friend.entity';
import { TokenFtEntity } from 'src/entity/tokenFt.entitiy';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { Avatar } from 'src/entity/avatar.entity';
import { AvatarService } from './avatar.service';
import { BlockedEntity } from 'src/entity/blocked.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity) private friendRepository: Repository<FriendEntity>,
    @InjectRepository(DataUserEntity) private dataUserRepository: Repository<DataUserEntity>,
	@InjectRepository(BlockedEntity) private blockedRepository: Repository<BlockedEntity>,
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
        const author : UserEntity = await this.findById(userId);
        const user1 : UserEntity = (userId < userId2) ? await this.findById(userId) : await this.findById(userId2);
        const user2 : UserEntity = (user1.id == userId) ? await this.findById(userId2) : await this.findById(userId);
        return this.friendRepository.save(new FriendEntity(author, user1, user2));
    }

    async removeFriendship(userId: string, userId2: string) {
        try {
            const friendship = await this.friendRepository.find({where: [
                {user1Id: userId, user2Id: userId2},
                {user1Id: userId2, user2Id: userId}
            ]})
            console.log("friendship find: ", friendship);
            return await this.friendRepository.remove(friendship[0]);
        }
        catch(err) {
            throw new HttpException('data not found or database error', HttpStatus.NOT_FOUND);
        }
    }

    async frienshipWaiting(userId: string, userId2: string) : Promise<boolean> {
        return this.friendRepository.exist({where: [
            {authorId: userId2, user1Id: userId2, user2Id: userId, accepted: false},
            {authorId: userId2, user1Id: userId, user2Id: userId2, accepted: false}
        ]});
    }

    async friendshipExist(userId: string, userId2: string) : Promise<boolean> {
        console.log(userId, userId2)
        return this.friendRepository.exist({where: [
            {user1Id: userId2, user2Id: userId, accepted: true},
            {user1Id: userId, user2Id: userId2, accepted: true},
            {authorId: userId, user1Id: userId, user2Id: userId2, accepted: false},
            {authorId: userId, user1Id: userId2, user2Id: userId, accepted: false}
        ]});
    }

    async friendshipPendingFromOther(otherId: string, userId: string) : Promise<boolean> {
        return this.friendRepository.exist({where: [
            {authorId: otherId, user1Id: userId, user2Id: otherId, accepted: false},
            {authorId: otherId, user1Id: otherId, user2Id: userId, accepted: false}
        ]});
    }

    async getFriendshipPending(userId: string, userId2: string) : Promise<FriendEntity> {
        const friendship = await this.friendRepository.find({where: [
            {authorId: userId2, user1Id: userId2, user2Id: userId, accepted: false},
            {authorId: userId2, user1Id: userId, user2Id: userId2, accepted: false}
        ]});
        return friendship[0];
    }
    
    async acceptFriendship(userId: string, userId2: string) {
        try {
            const friendship : FriendEntity = await this.getFriendshipPending(userId, userId2);
            return await this.friendRepository.update(friendship.id, {accepted: true})
        } catch (e) {
            throw new HttpException('error friend database', HttpStatus.INTERNAL_SERVER_ERROR)
        }
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

    async getFriends(userId: string, value: boolean) : Promise<FriendEntity[]> {
        try {
            const friends : FriendEntity[] = await this.friendRepository.find({where: [
                {user1Id: userId, accepted: value},
                {user2Id: userId, accepted: value}
            ]});
            return friends;
        } catch (e) {
            throw new HttpException('data not found', HttpStatus.NOT_FOUND);
        }
    }

	async setAvatar(userId: string, file: Express.Multer.File): Promise<void> {
		if (!file)
		  throw new HttpException('File required', HttpStatus.BAD_REQUEST);
		
		const filename = file.originalname;
		const datafile = file.buffer;
		if (await this.avatarService.exist(userId, filename))
		{
			throw new HttpException('Avatar Filename is already in database for this user', HttpStatus.CONFLICT);
		}
		const user: UserEntity = await this.findById(userId);
		const curr_avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		await this.avatarService.createAvatar(filename, datafile, user);
		if (curr_avatar)
			await this.avatarService.disabled(curr_avatar.id);
	  }
	
	async getAvatar(userId: string): Promise<Avatar> {
		const avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		if (!avatar)
		  throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
		return avatar;
	}

	async create_block(
		userId: string,
		user2Id: string
	): Promise<BlockedEntity> {
		const author : UserEntity = await this.findById(userId);
		const user1 : UserEntity = await this.findById(userId);
		const user2 : UserEntity = await this.findById(user2Id);
		const blocked = this.blockedRepository.create({author, user1, user2});
		try {
			await this.blockedRepository.save(blocked);
		} catch (error) {
			throw new HttpException('Could not save blocked entity', HttpStatus.BAD_REQUEST);
		}
		return blocked;
	}

	// Peut etre changer pour checker juste l'auteur de la requete
	async blockExist(
		userId: string,
		user2Id: string
	): Promise <boolean> {
		try {
		return await this.blockedRepository.exist({where: [
			{user1Id: user2Id, user2Id: userId},
			{user1Id: userId, user2Id: user2Id}
		]});
	} catch (error) {
		throw new HttpException('Error Database', HttpStatus.NOT_FOUND);
	}
	}

	async blockandauthorExist(
		userId: string,
		user2Id: string
	): Promise <boolean> {
		try {
		return await this.blockedRepository.exist({where: [
			{user1Id: user2Id, user2Id: userId, authorId: userId},
			{user1Id: userId, user2Id: user2Id, authorId: userId}
		]});
		} catch(error) {
			throw new HttpException('Error database', HttpStatus.NOT_FOUND);
		}
	}

	async deleteBlock(userId: string, id: string): Promise<void> {
		const block: BlockedEntity = await this.blockedRepository.findOne({where: 
			{user1Id: userId, user2Id: id, authorId: userId}});
		try {
		  await this.blockedRepository.delete(block.id);
		} catch (error) {
		  throw new HttpException('Could not destroy blockEntity', HttpStatus.BAD_REQUEST);
		}
	}

	async getBlock(userId: string): Promise<BlockedEntity[]> {
		const block: BlockedEntity[] = await this.blockedRepository.find({where: {authorId: userId}});
		return block;
	}
}
