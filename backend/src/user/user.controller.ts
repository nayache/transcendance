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
    async savePseudo(@User() userId: string, @Body('pseudo') pseudo?: string) {
        if (!pseudo)
            throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)

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
	): Promise<StreamableFile> {
	  const avatar = await this.userService.getAvatar(userId);
	  console.log(avatar)
	  return this.avatarService.toStreamableFile(avatar.datafile);
	}

	@Get('avatar/all')
	async getAllAvatar(
		@User() userId: string,
	): Promise <StreamableFile[]> {
		const avatar_array : Avatar[] = await this.avatarService.getAllAvatars(userId);
		return (this.avatarService.toStreamableFiles(avatar_array));
	}
  
    @Patch('avatar')
      @UseInterceptors(FileInterceptor('file'))
      async updateAvatar(
         @User() userId: string,
         @UploadedFile() file?: Express.Multer.File,
      ): Promise<StreamableFile> {
        if(!file)
            throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)
        this.userService.setAvatar(userId, file);
        const avatar = await this.userService.getAvatar(userId);
        console.log('avatar:', avatar);
        return this.avatarService.toStreamableFile(avatar.datafile);
    }

/*	@Patch('avatar')
  	@UseInterceptors(FileInterceptor('file'))
  	updateAvatar(
   	  @User() userId: string,
   	  @UploadedFile() file?: Express.Multer.File,
  	): Promise<void> {
        if(!file)
            throw new HttpException('invalid argument', HttpStatus.BAD_REQUEST)
      return this.userService.setAvatar(userId, file);
    }*/
}
