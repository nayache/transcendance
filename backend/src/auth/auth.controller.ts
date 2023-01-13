import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}
    
    @Get()
    auth(@Query('code') code: string) {
        return this.authService.authentification(code);
    }
}
