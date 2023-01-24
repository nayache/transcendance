import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './entity/user.entity';
import { GoogleStrategy } from './auth/google.strategy';
import { TokenFtVerify } from './middlewares/token42.middleware';
import { JwtDecoding } from './middlewares/jwt.middleware';
import { TwoFaAuth } from './middlewares/twofaAuth.middleware';
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DV_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity],
    synchronize: true,
  })],
  controllers: [AppController, TwoFactorAuthController, TwoFactorAuthController],
  providers: [AppService, GoogleStrategy, TwoFactorAuthService],
})
//export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoding).exclude('/auth').forRoutes('/')
    consumer.apply(TokenFtVerify).exclude('/auth').forRoutes('/')
    consumer.apply(TwoFaAuth).exclude('/auth').forRoutes('/')
  }  
}