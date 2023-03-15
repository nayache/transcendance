import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';

@Module({
  imports: [forwardRef(() => ChatModule), forwardRef(() => UserModule), TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
