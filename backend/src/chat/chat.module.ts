import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChannelEntity } from './entity/channel.entity';
import { Member } from './entity/member.entity';
import { MessageEntity } from './entity/message.entity';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([ChannelEntity, Member, MessageEntity])],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
