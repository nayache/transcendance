import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  fnn() {
    return "Hi"
  }

  @Get('/hello')
  fn(@User() userId: string) {
    return ('hello')
  }

}
