import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), PassportModule.register({ defaultStrategy: 'jwt'}),
  JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '30s' } })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
