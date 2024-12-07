import { Module } from '@nestjs/common';
import { TrandkeywordsService } from './trandkeywords.service'; // 서비스 임포트
import { Trandkeyword } from './entities/trandkeyword.entity'; // 엔티티 임포트
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrandkeywordsController } from './trandkeywords.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trandkeyword])], // Trandkeyword 엔티티 등록
  controllers: [TrandkeywordsController],
  providers: [TrandkeywordsService], // 서비스 등록
  exports: [TrandkeywordsService], // 다른 모듈에서 사용 가능하도록 export
})
export class TrandkeywordsModule {}
