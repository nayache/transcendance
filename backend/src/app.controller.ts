import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './entity/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
 
  @Get()
  fn(@User() user: UserEntity) {
    console.log('Welcome ' + user.login);
  }

}
