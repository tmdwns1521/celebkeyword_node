import { Injectable, NotFoundException } from '@nestjs/common';
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

  async checkSinglePlace(user: User): Promise<boolean> {
    const { singlePlaceDate } = user;

    if (!singlePlaceDate) {
      // singlePlaceDate가 null인 경우 현재 시간으로 설정
      user.singlePlaceDate = new Date();
      await this.userRepository.save(user); // DB 업데이트
      return true;
    }

    const currentTime = new Date();
    const differenceInSeconds =
      (currentTime.getTime() - singlePlaceDate.getTime()) / 1000;

    // 30초 이상 경과했으면 true, 아니면 false 반환
    return differenceInSeconds > 30;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const { username, password, email, phoneNumber, id } = createUserDto;

    // 이미 존재하는 유저 아이디 확인
    if (await this.isUserIdTaken(id)) {
      return { success: false, message: '이미 사용 중인 아이디입니다.' };
    }

    // 이미 존재하는 이메일 확인
    if (await this.isEmailTaken(email)) {
      return { success: false, message: '이미 사용 중인 이메일입니다.' };
    }

    // 비밀번호 복잡도 검사
    if (!this.isPasswordStrong(password)) {
      return {
        success: false,
        message:
          '비밀번호는 최소 8자 이상이어야 하며, 특수 문자를 포함해야 합니다.',
      };
    }

    // 이메일 인증 토큰 생성
    const emailVerificationToken = randomBytes(32).toString('hex');

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 유저 생성
    const user = this.userRepository.create({
      userId: id,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      emailVerificationToken,
    });

    await this.userRepository.save(user);

    // 인증 이메일 전송
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${emailVerificationToken}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '이메일 인증',
        text: `이 링크를 클릭하여 이메일을 인증하세요: ${verificationUrl}`,
      });
    } catch (error) {
      console.log(error);
      return { success: false, message: '인증 이메일 전송에 실패했습니다.' };
    }

    return { success: true, message: '회원가입에 성공했습니다.', user };
  }

  async verifyEmailToken(token: string): Promise<any> {
    console.log(token);
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('유효하지 않은 토큰입니다.'); // 유효하지 않은 토큰
    }

    console.log('혁명');

    // 유저 이메일 인증 완료 및 토큰 삭제
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    console.log(user);
    await this.userRepository.save(user);

    console.log('개혁');

    return { success: true, message: '이메일 인증에 성공했습니다.' };
  }

  public async isUserIdTaken(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    return !!user;
  }

  // 이메일 중복 확인 메서드 예시
  public async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  // 비밀번호 강도 검사 메서드 예시
  public isPasswordStrong(password: string): boolean {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { userId, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      return { success: false, message: '유저가 존재하지 않습니다.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: '비밀번호가 틀렸습니다.' };
    }

    // 이메일 인증 여부 확인
    if (!user.isEmailVerified) {
      return { success: false, message: '이메일 인증이 필요합니다.' };
    }

    const payload = {
      userId: user.userId,
      userName: user.username,
      sub: user.id,
    }; // JWT Payload 설정

    return {
      token: this.jwtService.sign(payload),
      userId: user.userId,
      userName: user.username,
      success: true,
    };
  }

  async findById(id: number): Promise<User> {
    console.log('findById', id);
    return await this.userRepository.findOne({ where: { id } });
  }
}
