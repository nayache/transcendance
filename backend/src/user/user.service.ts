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
import { AppGateway, GameDto } from 'src/chat/app.gateway';
import { Status } from 'src/enums/status.enum';
import { ProfileDto } from 'src/dto/profile.dto';
import { GameService } from 'src/game/game.service';

export class UserPreview {
    pseudo: string;
    avatar: string;
}

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity) private friendRepository: Repository<FriendEntity>,
    @InjectRepository(DataUserEntity) private dataUserRepository: Repository<DataUserEntity>,
	@InjectRepository(BlockedEntity) private blockedRepository: Repository<BlockedEntity>,
    @Inject(forwardRef(() => AppGateway)) private readonly appGateway: AppGateway,
    @Inject(forwardRef(() => GameService)) private readonly gameService: GameService,
	private readonly avatarService: AvatarService) {}
    
    private requiredXp: number[] = [420, 1050, 2625, 6587, 16468, 41000, 102927, 257300, 500000, 999999];
    private achievements: string[] = ["First Win", "Clean Sheet", "PONG MASTER"];
    
    async saveUser(login: string) {
        try {
            const user : UserEntity = await this.userRepository.save(new UserEntity(login))
            const data : DataUserEntity = await this.dataUserRepository.save(new DataUserEntity(user))
            await this.userRepository.update(user.id, {data: data})
            return user;
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }
    
    async getUsersPreview(): Promise<UserPreview[]> {
        let previews: UserPreview[] = [];
        try {
            const users: UserEntity[] = await this.userRepository.find();
            await Promise.all(users.map(async (user) => {
                if (user.pseudo) {
                    const avatar: string = await this.getAvatarfile(user.id);
                    previews.push({ pseudo: user.pseudo, avatar });
                }
            }));
            return previews;
        } catch (err) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)
        }
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
        return (pseudo.length > 3 && pseudo.length < 21);
    }

    async pseudoExist(pseudo: string): Promise<boolean> {
        return this.userRepository.exist({ where: {pseudo: pseudo}});
    }

    async addPseudo(id: string, pseudo: string) {
        const user = await this.findById(id);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')
        if (user.pseudo && await this.pseudoExist(pseudo))
            return null;
        try {
        	return await this.userRepository.update(id ,{pseudo: pseudo});
		} catch (e)
		{
			throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
		}
    }

    async updateTwoFa(id: string, value: boolean) {
		try {
        	return await this.userRepository.update(id, {twoFaEnabled: value});
		} catch (e)
		{
			throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
		}
    }

    async updateTwoFaSecret(id: string, value: string) {
		try {
        	return await this.userRepository.update(id, { TwoFaSecret: value });
		} catch (e)
		{
			throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
		}
    }

    async getTwoFa(id: string): Promise<boolean> {
        const user = await this.findById(id);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')
        return user.twoFaEnabled;
    }
    
    async getTwoFaSecret(id: string): Promise<string> {
        const user = await this.findById(id);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')
        return user.TwoFaSecret;
    }

    async getPseudoById(id: string) : Promise<string> {
        try {
            const user = await this.findById(id);
            if (user && user.pseudo)
                return user.pseudo 
            return null;
        } catch {
            return null;
        }
    }

    async getUser(user: UserEntity) : Promise<userDto> {
        const avatar: string = (user.avatar) ? this.avatarService.toStreamableFile(user.avatar): null;
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
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')
        try {
            return await this.userRepository.delete(user.id);
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)
        }
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
        if (!user1 || !user2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')
        console.log(userId, userId2);
        console.log(user1.id, user2.id);
        try {
            return await this.friendRepository.save(new FriendEntity(author, user1, user2));
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)
        }
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
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)
        }
    }

    async getFriendshipInWaiting(userId: string) : Promise<FriendEntity[]> {
        try {
            return await this.friendRepository.find({where: [
                {authorId: Not(userId), user1Id: userId, accepted: false},
                {authorId: Not(userId), user2Id: userId, accepted: false}
            ]});
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)            
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
        try {
            const friendship = await this.friendRepository.find({where: [
                {authorId: userId2, user1Id: userId2, user2Id: userId, accepted: false},
                {authorId: userId2, user1Id: userId, user2Id: userId2, accepted: false}
            ]});
            return friendship[0];
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)            
        }
    }
    
    async acceptFriendship(userId: string, userId2: string) {
        try {
            const friendship : FriendEntity = await this.getFriendshipPending(userId, userId2);
            return await this.friendRepository.update(friendship.id, {accepted: true})
        } catch (e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT)            
        }
    }
    
    async makeBlockedList(userId: string, blocked: BlockedEntity[]) : Promise<string[]> {
        let blockedList : string[] = blocked.map((blocked) => {
          return (blocked.user1Id == userId) ? blocked.user2Id : blocked.user1Id;
        })
        
        blockedList = await Promise.all( blockedList.map(async (id) => {
            const user = await this.findById(id);
            if (!user)
                throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
            return user.pseudo
        }))
        return blockedList;
    }
    
    async makeList(pendings: FriendEntity[], userId: string): Promise<UserPreview[]> {
        return Promise.all(pendings.map(async (pending) => {
            const id: string = (pending.user1Id === userId) ? pending.user2Id : pending.user1Id;
            const avatarObject: Avatar = await this.getAvatar(id);
            const avatar: string = (avatarObject) ? this.avatarService.toStreamableFile(avatarObject) : null;
            const pseudo: string = await this.getPseudoById(id);
            return { pseudo, avatar };
        }));
    }

    async makeFriendList(userId: string, friends: FriendEntity[]) : Promise<friendDto[]> {
        let friendList : string[] = friends.map((friend) => {
          return (friend.user1Id == userId) ? friend.user2Id : friend.user1Id;
        })
        
        const friendListDto: friendDto[] = await Promise.all( friendList.map(async (id) => {
            const user: UserEntity = await this.findById(id);
            if (!user)
                throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found')  
			const avatar: string = await this.getAvatarfile(user.id);
            const status: Status = await this.appGateway.getStatus(user.id);
            return { pseudo: user.pseudo, avatar: avatar, status };
        }))
        return friendListDto;
    }

    async getFriendsSize(userId: string): Promise<number> {
        const friends: FriendEntity[] = await this.getFriends(userId, true);
        return (friends) ? friends.length : 0;
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

    async getProfile(targetId: string, userId?: string): Promise<ProfileDto> {
        const target: UserEntity = await this.findById(targetId);
        if (!target)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.TARGET, TypeErr.NOT_FOUND);
        const avatarObject: Avatar = await this.getAvatar(targetId);
        const avatar: string = (avatarObject) ? this.avatarService.toStreamableFile(avatarObject) : null// Sami rectifie ca stp
        const pseudo: string = target.pseudo;
        const level: number = target.data.level;
        const xp: number = target.data.xp;
        const requiredXp: number = this.requiredXp[level];
        const percentageXp: number = (xp * 100) / requiredXp;
        const wins: number = target.data.win;
        const looses: number = target.data.loose;
        const achievements: string[] = target.data.achievements;
        const history: GameDto[] = await this.gameService.getHistory(target.id);
        if (!userId) {
            const friends: number = await this.getFriendsSize(targetId);
            return { avatar, pseudo, friends, level, xp, requiredXp, percentageXp, achievements, wins, looses, history };
        } else {
            const relation: Relation = await this.getRelation(userId, targetId);
            const blocked: boolean = await this.blockandauthorExist(userId, targetId);
            return { avatar, pseudo, level, xp, requiredXp, percentageXp, achievements, wins, looses, history, relation, blocked };
        }
    }

	async setAvatar(userId: string, file: Express.Multer.File): Promise<void> {
		if (!file)
		  throw new HttpException('File required', HttpStatus.BAD_REQUEST);
		const filename = file.originalname;
		const datafile = file.buffer;
		const mimetype = file.mimetype ? file.mimetype : 'image/jpeg';
		const user: UserEntity = await this.findById(userId);
		const curr_avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		await this.avatarService.createAvatar(filename, datafile, mimetype, user);
		if (curr_avatar)
			await this.avatarService.deleteAvatar(curr_avatar.id);
	  }

	async getAvatar(userId: string): Promise<Avatar> {
		const avatar: Avatar = await this.avatarService.getCurrentAvatar(userId);
		return avatar;
	}

	async getAvatarfile(userId: string): Promise<string> {
		const avatar: Avatar = await this.getAvatar(userId);
        if (!avatar)
            return null;
		return this.avatarService.toStreamableFile(avatar);
	}

	async create_block(
		userId: string,
		user2Id: string
	): Promise<BlockedEntity> {
		const author : UserEntity = await this.findById(userId);
		const user1 : UserEntity = await this.findById(userId);
		const user2 : UserEntity = await this.findById(user2Id);
        if (!author || !user1 || !user2)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
		const blocked = this.blockedRepository.create({author, user1, user2});
		try {
			await this.blockedRepository.save(blocked);
		} catch (error) {
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.DATABASE, TypeErr.TIMEOUT, 'Could not save blocked entity');
		}
		return blocked;
	}

	// Peut etre changer pour checker juste l'auteur de la requete
	async blockExist(
		userId: string,
		user2Id: string
	): Promise <boolean> {
		return this.blockedRepository.exist({where: [
			{authorId: userId, user2Id: user2Id}
		]});
	}

	async blockandauthorExist(
		userId: string,
		user2Id: string
	): Promise <boolean> {
		return this.blockedRepository.exist({where: [
			{user1Id: user2Id, user2Id: userId, authorId: userId},
			{user1Id: userId, user2Id: user2Id, authorId: userId}
		]});
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

	async getBlock(userId: string): Promise<string[]> {
		try {
		    const block: BlockedEntity[] = await this.blockedRepository.find({where: {authorId: userId},relations: ['user2']});
		    let users: string[] = [];
		    for (let i = 0; i < block.length; i++)
		    {
			    let user = await this.findById(block[i].user2Id);
			    if (user)
				    users.push(user.pseudo);
		    }
		    return users;
		} catch(e) {
			return null;
		}
	}

    async findDataUserByUserId(userId: string): Promise<DataUserEntity> {
        const user: UserEntity = await this.findById(userId);
        if (!user)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND);
        return user.data;
    }

    async updateResults(userId: string, winnnig: boolean) {
        const dataUser: DataUserEntity = await this.findDataUserByUserId(userId);
        if (!dataUser)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'data user not found');
        try {
            if (winnnig)
                await this.dataUserRepository.update(dataUser.id, {win: dataUser.win + 1});
            else
                await this.dataUserRepository.update(dataUser.id, {loose: dataUser.loose + 1});
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    levelChecker(xp: number): number {
        let level: number = 0;
        while (xp >= this.requiredXp[level])
            level++;
        return (level + 1);
    }

    async updateXp(userId: string, xp: number) {
        const dataUser: DataUserEntity = await this.findDataUserByUserId(userId);
        if (!dataUser)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'data user not found');
        try {
            await this.dataUserRepository.update(dataUser.id, {xp: dataUser.xp + xp});
            const levelFromXp: number = this.levelChecker(dataUser.xp + xp);
            if (levelFromXp > dataUser.level) {
                await this.dataUserRepository.update(dataUser.id, {level: levelFromXp});
                this.appGateway.levelUp(userId, levelFromXp);
            }
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }

    deserveOneAchievement(collection: string[], lvl: number, winning: boolean, cleansheet: boolean): string {
        if (collection.length === 3)
            return null;
        if (winning && !collection.find((achievement) => achievement === this.achievements[0]))
            return this.achievements[0];
        else if (cleansheet && !collection.find((achievement) => achievement === this.achievements[1]))
            return this.achievements[1];
        else if (lvl === 10)
            return this.achievements[2];
        return null;
    }

    async updateAchievements(userId: string, winning: boolean, cleansheet: boolean) {
        const dataUser: DataUserEntity = await this.findDataUserByUserId(userId);
        if (!dataUser)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'data user not found');
        try {
            const unlockedAchievement: string = this.deserveOneAchievement(dataUser.achievements, dataUser.level, winning, cleansheet);
            if (unlockedAchievement) {
                console.log('==================> ACHIEVEMENT UNLOCKED <==========================')
                await this.dataUserRepository.update(dataUser.id, {achievements: [...dataUser.achievements, ...[unlockedAchievement]]});
            }
        } catch(e) {
            throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
        }
    }
}
