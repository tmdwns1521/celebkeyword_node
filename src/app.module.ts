import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { PlaceSingle } from './place/entities/place.single.entity';
import { TrandkeywordsModule } from './trandkeywords/trandkeywords.module';
import { Trandkeyword } from './trandkeywords/entities/trandkeyword.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TrandkeywordsSchedulerService } from './trandkeywords/schedulers/trandkeywords-scheduler.service';
import { BlogModule } from './blog/blog.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, PlaceSingle, Trandkeyword],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    PlaceModule,
    UserModule,
    AuthModule,
    TrandkeywordsModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, TrandkeywordsSchedulerService], // 여기에 스케줄러 서비스 추가
})
export class AppModule {}
