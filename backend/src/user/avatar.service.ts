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
		throw new ErrorException(HttpStatus.EXPECTATION_FAILED, AboutErr.DATABASE, TypeErr.TIMEOUT);
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

	async getMimeTypeFromArrayBuffer(arrayBuffer): Promise <string> {
  		const uint8arr = new Uint8Array(arrayBuffer)
  		const len = 4
  		if (uint8arr.length >= len) {
  		  let signatureArr = new Array(len)
  		  for (let i = 0; i < len; i++)
  		    signatureArr[i] = (new Uint8Array(arrayBuffer))[i].toString(16)
  		  const signature = signatureArr.join('').toUpperCase()
		  console.log(signature);

    		switch (signature) {
    		  case '89504E47':
    		    return 'image/png'
    		  case 'FFD8FFE0':
    		    return 'image/jpeg'
    		  default:
    		    return null }
  			}
  			return null 
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
