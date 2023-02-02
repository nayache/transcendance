import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedEntity } from 'src/entity/blocked.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
@Injectable()
export class BlockedService {
	constructor(@InjectRepository(BlockedEntity) private blockedRepository: Repository<BlockedEntity>,
	private readonly userService: UserService) {}

	async create_block(
		userId: string,
		user2Id: string
	): Promise<BlockedEntity> {
		const author : UserEntity = await this.userService.findById(userId);
		const user1 : UserEntity = await this.userService.findById(userId);
		const user2 : UserEntity = await this.userService.findById(user2Id);
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
		return this.blockedRepository.exist({where: [
			{user1Id: user2Id, user2Id: userId},
			{user1Id: userId, user2Id: user2Id}
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
}
