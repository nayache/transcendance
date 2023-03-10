import { forwardRef, HttpException, HttpStatus, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataUserEntity } from 'src/entity/data-user.entity';
import { FriendEntity } from 'src/entity/friend.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Not, Repository } from 'typeorm';
import { Avatar } from 'src/entity/avatar.entity';
import { AvatarService } from './avatar.service';
import { BlockedEntity } from 'src/entity/blocked.entity';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { userDto } from 'src/dto/user.dto';
import { Relation } from '../enums/relation.enum';
import { friendDto } from './user.controller';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity) private friendRepository: Repository<FriendEntity>,
    @InjectRepository(DataUserEntity) private dataUserRepository: Repository<DataUserEntity>,
	@InjectRepository(BlockedEntity) private blockedRepository: Repository<BlockedEntity>,
    @Inject(forwardRef(() => ChatGateway)) private readonly chatGateway: ChatGateway,
	private readonly avatarService: AvatarService) {}
    
    async saveUser(login: string) {
        const user : UserEntity = await this.userRepository.save(new UserEntity(login))
        const data : DataUserEntity = await this.dataUserRepository.save(new DataUserEntity(user))
        await this.userRepository.update(user.id, {data: data})
        return user
    }
    
    async findById(id: string) {
        return this.userRepository.findOneBy({id: id});
    }

    async findByLogin(login: string) {
        return this.userRepository.findOneBy({login: login});
    }
    
    async findByPseudo(pseudo: string) {
        return this.userRepository.findOneBy({pseudo: pseudo});
    }

    isValidPseudo(pseudo: string) : boolean {
        console.log('in validpseudo()',pseudo)
        if (pseudo.search(/\s/) != -1)
            return false
        return (pseudo.length > 3 && pseudo.length < 26);
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

    async getTwoFa(id: string): Promise<boolean> {
        const user = await this.findById(id);
        return user.twoFaEnabled;
    }
    
    async getTwoFaSecret(id: string): Promise<string> {
        const user = await this.findById(id);
        return user.TwoFaSecret;
    }

    async getPseudoById(id: string) : Promise<string> {
        try {
            const user = await this.findById(id);
            if (user && user.pseudo)
                return user.pseudo 
        } catch {
            return null;
        }
    }

    async getUser(user: UserEntity) : Promise<userDto> {
        const avatar: StreamableFile = (user.avatar?.datafile) ? this.avatarService.toStreamableFile(user.avatar.datafile): null;
        let friendlist: friendDto[] = null;
        let blockedlist: string[] = null;
        
        const friends: FriendEntity[] = await this.getFriends(user.id, true);
        friendlist = await this.makeFriendList(user.id, friends);
        
     //   const blocked: UserEntity[] = await this.getBlock(user.id);
      //  blockedlist = await this.makeBlockedList(user.id, blocked);
        
        return new userDto(user.pseudo, avatar, friendlist, blockedlist);
    }

    //test
    async getUsers() : Promise<UserEntity[]> {

        const users = await this.userRepository.find();
        console.log(users[0].data)
        return users
    }
    
    async removeUser(login: string) {
        const user = await this.findByLogin(login);
        return this.userRepository.delete(user.id);
    }

    async getRelation(userId: string, targetId: string): Promise<Relation> {
        if (await this.friendShipPending(userId, targetId))
            return Relation.PENDING;
        else
            return (await this.friendshipExist(userId, targetId)) ? Relation.FRIEND : Relation.UNKNOWN;
    }

    async createFriendship(userId: string, userId2: string) {
        // je creer le friend entity avec le premier id inferieur au second pour eviter doublon
        const author : UserEntity = await this.findById(userId);
        const user1 : UserEntity = (userId < userId2) ? await this.findById(userId) : await this.findById(userId2);
        const user2 : UserEntity = (user1.id == userId) ? await this.findById(userId2) : await this.findById(userId);
        console.log(userId, userId2);
        console.log(user1.id, user2.id);
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

    async getFriendshipInWaiting(userId: string) : Promise<FriendEntity[]> {
        return this.friendRepository.find({where: [
            {authorId: Not(userId), user1Id: userId, accepted: false},
            {authorId: Not(userId), user2Id: userId, accepted: false}
        ]});
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

    async friendShipPending(userId: string, userId2: string): Promise<boolean> {
        return this.friendRepository.exist({where: [
            {authorId: userId, user1Id: userId, user2Id: userId2, accepted: false},
            {authorId: userId, user1Id: userId2, user2Id: userId, accepted: false}
        ]})

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
    
    async makeBlockedList(userId: string, blocked: BlockedEntity[]) : Promise<string[]> {
        let blockedList : string[] = blocked.map((blocked) => {
          return (blocked.user1Id == userId) ? blocked.user2Id : blocked.user1Id;
        })
        
        blockedList = await Promise.all( blockedList.map(async (id) => {
            const user = await this.findById(id);
            return user.pseudo
        }))
        return blockedList;
    }
    
    async makeList(pendings: FriendEntity[], userId: string): Promise<string[]> {
        return Promise.all(pendings.map(async (pending) => {
            const id: string = (pending.user1Id === userId) ? pending.user2Id : pending.user1Id; 
            return await this.getPseudoById(id);
        }));
    }

    async makeFriendList(userId: string, friends: FriendEntity[]) : Promise<friendDto[]> {
        let friendList : string[] = friends.map((friend) => {
          return (friend.user1Id == userId) ? friend.user2Id : friend.user1Id;
        })
        
        const friendListDto: friendDto[] = await Promise.all( friendList.map(async (id) => {
            const user: UserEntity = await this.findById(id);
            const status: Status = await this.chatGateway.getStatus(user.id);
            return { pseudo: user.pseudo, status };
        }))
        return friendListDto;
    }

    async getFriends(userId: string, value: boolean) : Promise<FriendEntity[]> {
        try {
            const friends : FriendEntity[] = await this.friendRepository.find({where: [
                {user1Id: userId, accepted: value},
                {user2Id: userId, accepted: value}
            ]});
            return friends;
        } catch (e) {
            return null //possible better?
           // throw new HttpException('data not found', HttpStatus.NOT_FOUND);
        }
    }

	async setAvatar(userId: string, file: Express.Multer.File, number?: number): Promise<void> {
		if (!file)
		  throw new HttpException('File required', HttpStatus.BAD_REQUEST);
		const filename = file.originalname;
		const datafile = file.buffer;
		const user: UserEntity = await this.findById(userId);
		const curr_avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		await this.avatarService.createAvatar(filename, datafile, user, number);
		if (curr_avatar)
			await this.avatarService.disabled(curr_avatar.id);
	  }
	
	async getAvatar(userId: string): Promise<Avatar> {
		const avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		/* if (!avatar)
		  throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND); */
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
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.TIMEOUT, 'Could not save blocked entity');
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

	async getBlock(userId: string): Promise<UserEntity[]> {
		const block: BlockedEntity[] = await this.blockedRepository.find({where: {authorId: userId},relations: ['user2']});
		let user: UserEntity[] = [];
		for (let i = 0; i < block.length; i++)
		{
			user.push(await this.findById(block[i].user2Id));
		}
		return user;
	}
}
