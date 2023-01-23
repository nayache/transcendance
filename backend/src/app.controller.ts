import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.appService.googleLogin(req);
  }

  @Get('/hello')
  fn(@User() user: UserEntity) {
    console.log('Welcome ' + user.login);
  }

  vv() {

  }

}
