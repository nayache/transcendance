import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, StreamableFile, UploadedFile, UseInterceptors, Put} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { AvatarService } from './avatar.service';
import { Avatar } from 'src/entity/avatar.entity';
@Controller('user')
export class UserController {
    constructor(
		private readonly userService: UserService,
		private readonly avatarService: AvatarService,){}

    @Get('pseudo')
    async getPseudo(@User() userId: string) {
		console.log('userId:',userId)
        const pseudo = await this.userService.getPseudoById(userId)
        if (!pseudo)
            throw new HttpException('pseudo not found', HttpStatus.NOT_FOUND)
        
        return { pseudo: pseudo }
    }

    @Patch('pseudo')
    async savePseudo(@User() userId: string, @Body('pseudo') pseudo: string) {
        console.log('userId received: ', userId, 'pseudo in param: ', pseudo) 
        
        //if (!this.userService.isValidPseudo(pseudo))
        //    throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)    
        
        if (!await this.userService.addPseudo(userId, pseudo))
            throw new HttpException('pseudo already used by other user', HttpStatus.CONFLICT)

        return { statuscode: "200", pseudo: pseudo }
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
	  @UseInterceptors(FileInterceptor('file'))
	  async postpseudoAvatar(
		@User() userId: string,
		@Body('pseudo') pseudo?: string,
		@UploadedFile('file') file?: Express.Multer.File,
	): Promise <any> {
		try {
		  if (!pseudo)
			throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST);
		  await this.userService.setAvatar(userId, file);
		  const avatar = await this.userService.getAvatar(userId);
		  if (!await this.userService.addPseudo(userId, pseudo))
            throw new HttpException('pseudo already used by other user', HttpStatus.CONFLICT)
		  return {statuscode: 200,
			pseudo: pseudo, avatar: this.avatarService.toStreamableFile(avatar.datafile)
		  }
		} catch (error)
		{
			if (await this.userService.getPseudoById(userId) != pseudo && (await this.avatarService.getCurrentAvatar(userId)).file != file.filename)
				return {statuscode:400, errors: {type:"peusdo and avatar not set", pseudo:pseudo, avatar: file}};
		}
	}

	@Patch('avatar')
      @UseInterceptors(FileInterceptor('file'))
      async updateAvatar(
         @User() userId: string,
         @UploadedFile('file') file?: Express.Multer.File,
      ): Promise<any> {
		const num = await this.avatarService.countavatar(userId);
		console.log(num)
		if (num < 10) {
        	await this.userService.setAvatar(userId, file);
			const avatar = await this.userService.getAvatar(userId);
       		 console.log('avatar:', avatar);
			if (!avatar)
				return {};
       		return {
            	avatar: this.avatarService.toStreamableFile(avatar.datafile)
        	}
		}
		if (num > 9) {
			throw new HttpException('Already 10 avatars', HttpStatus.BAD_REQUEST);
		}
    }

	@Delete('avatar/:filename')
	  async deleteAvatar(
		 @User() userId: string,
		 @Body('filename') filename?: string
	  ) {
			if (!filename)
				throw new HttpException('filename for delete is not provided', HttpStatus.BAD_REQUEST);
			const avatarId = await this.avatarService.getavatarId(userId, filename);
			if (!avatarId)
				throw new HttpException('filename is not in database for this user', HttpStatus.BAD_REQUEST);
			if (avatarId == (await this.avatarService.getCurrentAvatar(userId)).id)
				throw new HttpException('cannot delete current avatar', HttpStatus.BAD_REQUEST);
			return this.avatarService.deleteAvatar(avatarId);
	  }
}
