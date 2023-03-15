import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AppGateway } from './app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChannelEntity } from './entity/channel.entity';
import { Member } from './entity/member.entity';
import { MessageEntity } from './entity/message.entity';
import { PrivateMessageEntity } from './entity/privateMessage.entity';
import { Mute } from './entity/mute.entity';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule), forwardRef(() => GameModule), TypeOrmModule.forFeature([ChannelEntity, Member, MessageEntity,
  PrivateMessageEntity, Mute])],
  providers: [ChatService, AppGateway],
  controllers: [ChatController],
  exports: [AppGateway, ChatService]
})
export class ChatModule {}
