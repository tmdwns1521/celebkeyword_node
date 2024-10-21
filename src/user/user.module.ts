import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com', // SMTP 서버
        port: 587,
        secure: false,
        auth: {
          user: 'celkey@naver.com', // 이메일
          pass: 'tmdwns5458@', // 비밀번호
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>', // 기본 발신자 설정
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
