import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './entity/user.entity';
import { JwtDecoding } from './middlewares/jwt.middleware';
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { FriendEntity } from './entity/friend.entity';
import { FriendController } from './friend/friend.controller';
import { Avatar } from './entity/avatar.entity';
import { DataUserEntity } from './entity/data-user.entity';
import { BlockedEntity } from './entity/blocked.entity';
import { BlockedController } from './blocked/blocked.controller';
import { ChatModule } from './chat/chat.module';
import { Channel } from './entity/channel.entity';

@Module({
  imports: [AuthModule, UserModule, ChatModule, ConfigModule, ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DV_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, FriendEntity, DataUserEntity, Avatar, BlockedEntity, Channel],
    synchronize: true,
  }),
  ],
  controllers: [AppController, TwoFactorAuthController, TwoFactorAuthController, FriendController, BlockedController],
  providers: [AppService, TwoFactorAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoding).exclude('/auth', '/auth/token', '/user/add/', '/user/rm', '/user/all').forRoutes('/')
  }  
}
