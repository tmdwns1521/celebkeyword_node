import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrandkeywordsService } from '../trandkeywords.service';

@Injectable()
export class TrandkeywordsSchedulerService {
  constructor(private readonly trandkeywordsService: TrandkeywordsService) {}

  // Nate에서 트렌드 키워드를 1시간마다 가져오기
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('Running scheduled task to fetch trending keywords...');
    await this.trandkeywordsService.getTrandKeywordWithNate(); // Nate 키워드 가져오기
    await this.trandkeywordsService.getTrandKeywordWithZum(); // Zum 키워드 가져오기
    await this.trandkeywordsService.getTrandKeywordWithNaver(); // Naver 키워드 가져오기
  }
}
