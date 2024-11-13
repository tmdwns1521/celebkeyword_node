import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt'는 Passport에서 사용하는 전략 이름입니다.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
