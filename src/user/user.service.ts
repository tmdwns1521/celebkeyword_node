import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email, phoneNumber } = createUserDto;

    // 이미 존재하는 유저 아이디 또는 이메일 확인
    if (await this.isUserIdTaken(email)) {
      throw new UnauthorizedException('이미 사용 중인 아이디입니다.');
    }

    // 이메일 인증 토큰 생성
    const emailVerificationToken = randomBytes(32).toString('hex');

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 유저 생성
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      emailVerificationToken, // 토큰 저장
    });

    await this.userRepository.save(user);

    // 인증 이메일 전송
    // const verificationUrl = `https://your-domain.com/verify-email?token=${emailVerificationToken}`;
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: '이메일 인증',
    //   text: `이 링크를 클릭하여 이메일을 인증하세요: ${verificationUrl}`,
    // });

    return user;
  }

  async verifyEmailToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) {
      return null; // 유효하지 않은 토큰
    }

    // 유저 이메일 인증 완료 및 토큰 삭제
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return user;
  }

  async isUserIdTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('유저 없음');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호 틀림');
    }

    const payload = { userId: user.email, sub: user.id }; // JWT Payload 설정
    return this.jwtService.sign(payload);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
