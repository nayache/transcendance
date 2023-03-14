import {
	HttpException,
	HttpStatus,
	Injectable,
	StreamableFile,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { catchError } from 'rxjs';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
  import { Readable } from 'stream';
  import { Repository } from 'typeorm';
  import { Avatar } from '../entity/avatar.entity';
  import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';
  
  @Injectable()
  export class AvatarService {
	constructor(@InjectRepository(Avatar) private avatarRepository: Repository<Avatar>) {}
  
	async createAvatar(
	  file: string,
	  datafile: Buffer,
	  user: UserEntity,
	  number?: number
	): Promise<Avatar> {
	  let highestNumber = 0;

	  if (!number) {
	    const avatars = await this.avatarRepository.find({
	  	  where: { userId: user.id },
		  });
		  for (const avatar of avatars) {
			if (avatar.number > highestNumber) {
			  highestNumber = avatar.number;
			}
		  }
		  highestNumber++;
		} else {
			const existingAvatar = await this.avatarRepository.findOne({
			  where: { userId: user.id, number },
			});
			if (existingAvatar) {
			  throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.DUPLICATED ,`Avatar with number ${number} already exists`);
			}
			highestNumber = number;
		  }
	  const avatar = this.avatarRepository.create({file, datafile, user, number: highestNumber});
  
	  try {
		await this.avatarRepository.save(avatar);
	  } catch (error) {
		throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.REJECTED);
	  }
	  return avatar;
	}
  
	async deleteAvatar(avatarId: string): Promise<void> {
	  try {
		await this.avatarRepository.delete(avatarId);
	  } catch (error) {
		throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.REJECTED);
	  }
	}
  
	toStreamableFile(data: Buffer): StreamableFile {
	  return new StreamableFile(Readable.from(data));
	}

	toStreamableFiles(avatar_array: Avatar[]): StreamableFile[] {
		let avatar_data : StreamableFile[] = [];
		for (let i = 0; i < avatar_array.length; i++)
			avatar_data.push(this.toStreamableFile(avatar_array[i].datafile));
		return avatar_data;
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
		return (res);
	}

	async disabled(avatarId: string): Promise<void> {
		try {
			await this.avatarRepository.update(avatarId, {Current: false});
		}
		catch (e)
		{
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.REJECTED);
		}
	}
	
	async getAllAvatars(userId: string): Promise<Avatar[]> {
		try {
			const avatars: Avatar[] = await this.avatarRepository.find({where: {userId: userId}, select: {datafile: true}});
			return avatars;
		} catch(error)
		{
			return (null);
		}
	}

	async getavatarId(userId:string, number: number): Promise<string> {
		try {
			const avatar: Avatar[] = await this.avatarRepository.find({where: {userId: userId, number}});
			return avatar[0].id;
		}
		catch (error)
		{
			return (null);
		}
	}

	async countavatar(userId: string): Promise<number> {
		const num: number = await this.avatarRepository.count({where: {userId: userId}});
		return num;
	}

  }
