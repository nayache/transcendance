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
import { GoogleAuth } from './middlewares/googleAuth.middleware';

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
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
//export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecoding).exclude('/auth').forRoutes('/')
    consumer.apply(TokenFtVerify).exclude('/auth').forRoutes('/')
    consumer.apply(GoogleAuth).exclude('/auth').forRoutes('/')
  }  
}