import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { userId, username, password, email, phoneNumber } = createUserDto;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 유저 생성
    const user = this.userRepository.create({
      userId,
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    // 저장
    return this.userRepository.save(user);
  }

  async isUserIdTaken(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });
    return !!user;
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { userId, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException('유저 없음');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호 틀림');
    }

    const payload = { userId: user.userId, sub: user.id }; // JWT Payload 설정
    return this.jwtService.sign(payload);
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
