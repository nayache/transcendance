import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService,
    private readonly userService: UserService) {}
    
    @Get()
    auth(@Query('code') code: string) {
        // penser a bien gerer error data
        const data = this.authService.authentification(code);

       // return (res);
       return data
    }
}
