import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChannelEntity } from './entity/channel.entity';
import { Member } from './entity/member.entity';
import { MessageEntity } from './entity/message.entity';
import { PrivateMessageEntity } from './entity/privateMessage.entity';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule), TypeOrmModule.forFeature([ChannelEntity, Member, MessageEntity,
  PrivateMessageEntity])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatGateway, ChatService]
})
export class ChatModule {}
