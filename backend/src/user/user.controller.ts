import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('choosename')
    savePseudo(@Query('pseudo') pseudo: string) {
        
        if (!this.userService.checkAuthenticityPseudo(pseudo))
            return new BadRequestException()
        
        this.userService.addPseudo(pseudo);
    }

    @Get('list')
    getAll() {
        return this.userService.getUsers()
    }
}
