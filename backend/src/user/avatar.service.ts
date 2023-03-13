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
	  mimetype: string,
	  user: UserEntity,
	): Promise<Avatar> {
	  const avatar = this.avatarRepository.create({file, datafile, user, mimetype});
  
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
		throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
	  }
	}
  
	toStreamableFile(avatar: Avatar): string {
		const type = avatar.mimetype;
		const dataImagePrefix = 'data:'.concat(type);
		const dataImageSuffix = dataImagePrefix.concat(';base64,');
		console.log(dataImageSuffix);
		let base = avatar.datafile.toString('base64');
		let final= dataImageSuffix.concat(base);
		return final;
	}

	async getCurrentAvatar(userId: string): Promise<Avatar> {
		try {
			const avatar: Avatar[] = await this.avatarRepository.find({where: {userId: userId}});
			return avatar[0];
		}
		catch(e)
		{
			return (null);
		}
	}

	async getavatarId(userId:string, filename: string): Promise<string> {
		try {
			const avatar: Avatar[] = await this.avatarRepository.find({where: {userId: userId}});
			return avatar[0].id;
		}
		catch (error)
		{
			return (null);
		}
	}
  }
