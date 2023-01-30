import {
	HttpException,
	HttpStatus,
	Injectable,
	StreamableFile,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
  import { Readable } from 'stream';
  import { Repository } from 'typeorm';
  import { Avatar } from '../entity/avatar.entity';
  import { UserEntity } from '../entity/user.entity';
  
  @Injectable()
  export class AvatarService {
	constructor(
	  @InjectRepository(Avatar)
	  private avatarRepository: Repository<Avatar>,
	) {}
  
	async createAvatar(
	  file: string,
	  datafile: Buffer,
	  user: UserEntity,
	): Promise<Avatar> {
	  const avatar = this.avatarRepository.create({file, datafile, user });
  
	  try {
		await this.avatarRepository.save(avatar);
	  } catch (error) {
		throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
	  }
	  return avatar;
	}
  
	async deleteAvatar(avatarId: string): Promise<void> {
	  try {
		await this.avatarRepository.delete(avatarId);
	  } catch (error) {
		throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
	  }
	}
  
	toStreamableFile(data: Buffer): StreamableFile {
	  return new StreamableFile(Readable.from(data));
	}

	async getCurrentAvatar(userId: string): Promise<Avatar> {
		try {
			const avatars: Avatar[] = await this.avatarRepository.find({where: {userId: userId, Current: true}});
			return avatars[0];
		}
		catch(e)
		{
			return (null);
		}
	}

	async exist(userId: string, filename: string): Promise<boolean> {
		const res: boolean = await this.avatarRepository.exist({where: [{userId: userId, file: filename}]})
		console.log(res)
		return (res);
	}

	async disabled(avatarId: string): Promise<void> {
		try {
			await this.avatarRepository.update(avatarId, {Current: false});
		}
		catch (e)
		{
			throw new HttpException('Cannot update turnoff current avatar', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
  }