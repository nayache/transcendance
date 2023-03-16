import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, StreamableFile, UploadedFile, UseInterceptors, Put} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/entity/user.entity';
import { UserPreview, UserService } from './user.service';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/entity/avatar.entity';
import { ErrorException } from 'src/exceptions/error.exception';
import { AboutErr, TypeErr } from '../enums/error_constants';
import { extname } from 'path';
import { userDto } from 'src/dto/user.dto';
import { Relation } from '../enums/relation.enum';
import { Status } from 'src/enums/status.enum';
import { ProfileDto } from 'src/dto/profile.dto';
import * as sharp from 'sharp';
import isEmptyArrayBuffer from 'is-empty-array-buffer';

export class friendDto {
	pseudo: string;
	avatar: string;
	status: Status;
}

@Controller('users')
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

	@Get('all')
	async getUsersNames() {
		const users: UserPreview[] = await this.userService.getUsersPreview();
		return {users};
	}

	// A SUPP???? 
	/*
	@Get()
	async getUser(@User() userId: string) {
		const user: UserEntity = await this.userService.findById(userId);
		if (!user)
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
		const data: userDto = await this.userService.getUser(user);
		return { user: data }
	}
	
	@Get('lalalal/:pseudo') // route a modifier
	async getAnUser(@Param('pseudo') pseudo: string) {
		const user: UserEntity = await this.userService.findByPseudo(pseudo);
		if (!user)
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'user not found');
		const data: userDto = await this.userService.getUser(user);
		return { user: data }
	}*/

	@Get('friends/relation/:pseudo')
	async getRelation(@User() userId: string, @Param('pseudo') pseudo: string) {
		if (!pseudo)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.EMPTY, 'empty pseudo argument.');
		const target: UserEntity = await this.userService.findByPseudo(pseudo);
		if (!target) 
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'target user not found.');
		if (userId === target.id)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.INVALID, 'invalid target(himself)');
		const relation: Relation = await this.userService.getRelation(userId, target.id);
		const blocked: boolean = await this.userService.blockandauthorExist(userId, target.id);
		return {relation, blocked};
	}

	@Get('profile')
	async getMyProfile(@User() userId: string) {
		const profile: ProfileDto = await this.userService.getProfile(userId);
		return { profile };
	}
	
	@Get('profile/:pseudo')
	async getProfile(@User() userId: string, @Param('pseudo') pseudo: string) {
		const target: UserEntity = await this.userService.findByPseudo(pseudo);
		if (!target)
			throw new ErrorException(HttpStatus.NOT_FOUND, AboutErr.USER, TypeErr.NOT_FOUND, 'target not found');
		if (userId === target.id)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.USER, TypeErr.INVALID, 'invalid target(himself)');
		const profile: ProfileDto = await this.userService.getProfile(target.id, userId);
		return { profile };
	}

    //for test
/*    @Get('all')
    async getAll() : Promise<UserEntity[]> {
        return this.userService.getUsers();
    }*/

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
	): Promise<{avatar: string}> {
	  const avatar = await this.userService.getAvatar(userId);
	  if (!avatar)
		return ({avatar: null});
	  return ({avatar: this.avatarService.toStreamableFile(avatar)});
	}

	@Get('avatar/:pseudo')
	async getProfileAvatar(
		@Param('pseudo') pseudo: string,
	): Promise <{avatar: string}> {
		console.log(pseudo)
		if (!pseudo)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.EMPTY, 'Empty pseudo');
		const user = await this.userService.findByPseudo(pseudo);
		if (!user)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.TARGET, TypeErr.NOT_FOUND, 'pseudo does not exist');
		const avatarObject: Avatar = await this.userService.getAvatar(user.id);
		const avatar: string = (avatarObject) ? this.avatarService.toStreamableFile(avatarObject) : null;
		return { avatar } ;
	}
	
	@Post('')
@UseInterceptors(FileInterceptor('file', {
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Check image dimensions
            cb(null, true);
        } else {
            cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`Unsupported file type ${extname(file.originalname)}`), false);
        }
    },
    limits: {
        files: 1,
        fileSize: 10 * 10 * 10 * 10 * 10 * 10  // 10 mb in bytes
    }
}))
async postpseudoAvatar(
    @User() userId: string,
    @Body('pseudo') pseudo?: string,
    @UploadedFile('file') file?: Express.Multer.File,
): Promise<any> {
    if (!pseudo)
        throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.PSEUDO, TypeErr.EMPTY, 'Empty pseudo');
    if (await this.userService.pseudoExist(pseudo))
        throw new ErrorException(HttpStatus.CONFLICT, AboutErr.PSEUDO, TypeErr.DUPLICATED, 'pseudo already used')
    if (file) {
		const whitelist = [
			'image/jpeg',
			'image/png'
		];
		console.log(file.buffer);
		if (file.buffer.length == 0)
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID, 'File is not an image');
		const mime = await this.avatarService.getMimeTypeFromArrayBuffer(file.buffer);
		if (!whitelist.includes(mime))
			throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID, 'File is not an image');
		const resize = await sharp(file.buffer).resize(200, 200).toBuffer();
		file.buffer = resize;
        await this.userService.setAvatar(userId, file);
    }
    const avatar = await this.userService.getAvatar(userId);
	await this.userService.addPseudo(userId, pseudo);
    if (!avatar)
        return {pseudo: pseudo, avatar: null}
    return {pseudo: pseudo, avatar: this.avatarService.toStreamableFile(avatar)}
}

	@Patch('avatar')
      @UseInterceptors(FileInterceptor('file', {fileFilter: (req: any, file: any, cb: any) => {
        //console.log(file.mimetype.split('/')[1])
		if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
			//if (file.mimetype.split('/')[1] != extname(file.originalname))
			//	cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`File Type does not match file extension ${file.mimetype}, ${extname(file.originalname)}`), false);
            cb(null, true);
        } else {
            // Reject file
            cb(new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.INVALID,`Unsupported file type ${file.mimetype}`), false);
        }
    },
    limits: {
        files: 1,
        fileSize: 10 * 10 * 10 * 10 * 10 * 10  // 10 mb in bytes
    }}))
      async updateAvatar(
         @User() userId: string,
         @UploadedFile('file') file?: Express.Multer.File
      ): Promise<any> {
			if (file)
			{
				const resize = await sharp(file.buffer).resize(200, 200).toBuffer();
				file.buffer = resize;
        		await this.userService.setAvatar(userId, file);
			}
			const avatar = await this.userService.getAvatar(userId);
			if (!avatar)
				return {avatar: null};
       		return {
            	avatar: this.avatarService.toStreamableFile(avatar)}
			}

	@Delete('avatar')
		async deleteAvatar(@User() userId: string) 
		{
			const avatar = await this.avatarService.getCurrentAvatar(userId);
			if (!avatar)
				throw new ErrorException(HttpStatus.BAD_REQUEST, AboutErr.AVATAR, TypeErr.NOT_FOUND, `No avatar for user`);
			await this.avatarService.deleteAvatar(avatar.id);
			return {};
		}
}
