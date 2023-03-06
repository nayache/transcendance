import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './entity/user.entity';
import { JwtDecoding } from './middlewares/jwt.middleware';
import { FriendEntity } from './entity/friend.entity';
import { FriendController } from './friend/friend.controller';
import { Avatar } from './entity/avatar.entity';
import { DataUserEntity } from './entity/data-user.entity';
import { BlockedEntity } from './entity/blocked.entity';
import { BlockedController } from './blocked/blocked.controller';
import { ChatModule } from './chat/chat.module';
import { ChannelEntity } from './chat/entity/channel.entity';
import { Member } from './chat/entity/member.entity';
import { MessageEntity } from './chat/entity/message.entity';
import { PrivateMessageEntity } from './chat/entity/privateMessage.entity';

@Module({
  imports: [AuthModule, UserModule, ChatModule, ConfigModule, ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, FriendEntity, DataUserEntity, Avatar, BlockedEntity, ChannelEntity, Member,
      MessageEntity, PrivateMessageEntity],
    synchronize: true,
  }),
  ],
  controllers: [AppController, FriendController, BlockedController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoding).exclude('/auth', '/auth/fake/:login', '/auth/token', '/user/add/', '/user/rm', '/user/all').forRoutes('/')
  }  
}
