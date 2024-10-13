import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
// 엔티티 임포트 (예시)

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql', // 데이터베이스 타입
      host: process.env.DB_HOST, // 데이터베이스 호스트
      port: +process.env.DB_PORT, // MySQL 포트
      username: process.env.DB_USERNAME, // MySQL 사용자명
      password: process.env.DB_PASSWORD, // MySQL 비밀번호
      database: process.env.DB_NAME, // 데이터베이스 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 (모델) 목록
      synchronize: true, // 자동으로 데이터베이스와 동기화 (개발 환경에서만 사용 권장)
    }),
    PlaceModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
