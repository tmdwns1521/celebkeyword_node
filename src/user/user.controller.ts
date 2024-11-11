import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('check-username/:userId')
  async checkUsername(@Param('userId') userId: string) {
    const isTaken = await this.userService.isUserIdTaken(userId);
    return { isTaken };
  }
  @Get('verify-email')
  async verifyEmail(@Param('token') token: string) {
    const user = await this.userService.verifyEmailToken(token);
    if (user) {
      return { message: '이메일 인증이 완료되었습니다.' };
    }
    return { message: '인증 실패: 유효하지 않은 토큰입니다.' };
  }
}
