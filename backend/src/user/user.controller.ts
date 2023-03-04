import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, StreamableFile, UploadedFile, UseInterceptors, Put} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/entity/avatar.entity';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from '../enums/error_constants';
import { extname } from 'path';
import { userDto } from 'src/dto/user.dto';
import { Relation } from '../enums/relation.enum';
import { Status } from 'src/enums/status.enum';

export class friendDto {
	pseudo: string;
	status: Status;
}

@Controller('user')
export class UserController {
    constructor(
		private readonly userService: UserService,
		private readonly avatarService: AvatarService,){}

    @Get('pseudo')
    async getPseudo(@User() userId: string) {
        const pseudo = await this.userService.getPseudoById(userId)
        if (!pseudo)
            throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.PSEUDO, TypeErr.NOT_FOUND, 'user not have pseudo');
        
        return { pseudo };
    }

    @Patch('pseudo')
    async savePseudo(@User() userId: string, @Body('pseudo') pseudo?: string) {
        if (!pseudo)
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.PSEUDO, TypeErr.EMPTY, 'cannot read pseudo parameter');

        if (!this.userService.isValidPseudo(pseudo))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.PSEUDO, TypeErr.INVALID, 'pseudo input is invalid');
        
        if (!await this.userService.addPseudo(userId, pseudo))
            throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.PSEUDO, TypeErr.DUPLICATED, 'pseudo is already used');

        return { pseudo };
    }

	@Get()
	async getUser(@User() userId: string) {
		const user: UserEntity = await this.userService.findById(userId);
		if (!user)
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
		const data: userDto = await this.userService.getUser(user);
		return { user: data }
	}
	
	@Get('/:pseudo')
	async getAnUser(@Param('pseudo') pseudo: string) {
		const user: UserEntity = await this.userService.findByPseudo(pseudo);
		if (!user)
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
		const data: userDto = await this.userService.getUser(user);
		return { user: data }
	}

	@Get('friends/relation/:pseudo')
	async getRelation(@User() userId: string, @Param('pseudo') pseudo: string) {
		if (!pseudo)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.EMPTY, 'empty pseudo argument.');
		const target: UserEntity = await this.userService.findByPseudo(pseudo);
		if (!target) 
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'target user not found.');
		const relation: Relation = await this.userService.getRelation(userId, target.id);
		const blocked: boolean = await this.userService.blockandauthorExist(userId, target.id);	
		return {relation, blocked};
	}

    //for test
    @Get('all')
    async getAll() : Promise<UserEntity[]> {
        return this.userService.getUsers();
    }

    //for test
    @Post('add')
    async addUser(@Query('login') login: string) {
        return this.userService.saveUser(login)
    }

    //for test
    @Delete('rm')
    async removeUser(@Query('login') login: string) {
        return this.userService.removeUser(login);
    }

	//avatar
	@Get('avatar')
	async getAvatar(
	  @User() userId: string,
	): Promise<{avatar: StreamableFile}> {
	  const avatar = await this.userService.getAvatar(userId);
	  return ({avatar: this.avatarService.toStreamableFile(avatar.datafile)});
	}

	@Get('avatar/all')
	async getAllAvatar(
		@User() userId: string,
	): Promise <{avatars: StreamableFile[]}> {
		const avatar_array : Avatar[] = await this.avatarService.getAllAvatars(userId);
		return ({avatars: this.avatarService.toStreamableFiles(avatar_array)});
	}
	
	@Post('')
	  @UseInterceptors(FileInterceptor('file', {fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype.split('/')[1])
		if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
			//if (file.mimetype.split('/')[1] != extname(file.originalname))
			//	cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`File Type does not match file extension ${file.mimetype}, ${extname(file.originalname)}`), false);
            cb(null, true);
        } else {
            // Reject file
            cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`Unsupported file type ${extname(file.originalname)}`), false);
        }
    }}))
	  async postpseudoAvatar(
		@User() userId: string,
		@Body('pseudo') pseudo?: string,
		@UploadedFile('file') file?: Express.Multer.File,
	): Promise <any> {
		  if (!pseudo)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.PSEUDO, TypeErr.EMPTY, 'Empty pseudo');
		  if (!await this.userService.addPseudo(userId, pseudo))
            throw new ErrorException(HttpStatus.CONFLICT, AboutErr.PSEUDO, TypeErr.DUPLICATED, 'pseudo already used')
		  if (file) {
			//console.log(await fileTypeFromBuffer(file.buffer))
			console.log('here')
		    await this.userService.setAvatar(userId, file);
		  }
		  const avatar = await this.userService.getAvatar(userId);
		  if (!avatar)
		  	return {pseudo: pseudo, avatar: null}
		  return {pseudo: pseudo, avatar: this.avatarService.toStreamableFile(avatar.datafile)}
	}

	@Patch('avatar')
      @UseInterceptors(FileInterceptor('file', {fileFilter: (req: any, file: any, cb: any) => {
        //console.log(file.mimetype.split('/')[1])
		if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
			//if (file.mimetype.split('/')[1] != extname(file.originalname))
			//	cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`File Type does not match file extension ${file.mimetype}, ${extname(file.originalname)}`), false);
            cb(null, true);
        } else {
            // Reject file
            cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`Unsupported file type ${extname(file.originalname)}`), false);
        }
    }}))
      async updateAvatar(
         @User() userId: string,
         @UploadedFile('file') file?: Express.Multer.File,
		 @Body('number') number?: number
      ): Promise<any> {
		const num = await this.avatarService.countavatar(userId);
		if (num < 10) {
        	await this.userService.setAvatar(userId, file, number);
			const avatar = await this.userService.getAvatar(userId);
       		 console.log('avatar:', this.avatarService.toStreamableFile(avatar.datafile));
			if (!avatar)
				return {};
       		return {
            	avatar: this.avatarService.toStreamableFile(avatar.datafile)
        	}
		}
		throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.DUPLICATED,'Already 10 avatars');
    }

	@Delete('avatar/:id')
	  async deleteAvatar(
		 @User() userId: string,
		 @Body('number') number?: number
	  ) {
			if (!number)
				throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.EMPTY, 'number for delete is not provided');
			const avatarId = await this.avatarService.getavatarId(userId, number);
			if (!avatarId)
				throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.NOT_FOUND, `number ${number} is not used by ${userId}`);
			if (avatarId == (await this.avatarService.getCurrentAvatar(userId)).id)
				throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID, 'cannot delete current avatar');
			return this.avatarService.deleteAvatar(avatarId);
	  }
}
