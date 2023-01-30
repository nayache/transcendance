import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { FriendEntity } from 'src/entity/friend.entity';
<<<<<<< HEAD
import { Avatar } from 'src/entity/avatar.entity';
import { AvatarService } from './avatar.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserEntity, FriendEntity, Avatar])],
  providers: [UserService, AvatarService],
=======
import { DataUserEntity } from 'src/entity/data-user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserEntity, FriendEntity, DataUserEntity])],
  providers: [UserService],
>>>>>>> master
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
