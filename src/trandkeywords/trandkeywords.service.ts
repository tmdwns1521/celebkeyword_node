import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Trandkeyword } from './entities/trandkeyword.entity';
import { Between, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { TrandkeywordDTO } from './dto/trandkeyword.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TrandkeywordsService {
  constructor(
    @InjectRepository(Trandkeyword)
    private readonly trandKeywordRepository: Repository<Trandkeyword>,
  ) {}

  async getTrandKeywordAll() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    // 오늘 날짜에 포함된 데이터만 조회
    const trandKeywords = await this.trandKeywordRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay), // createdAt 필드 기준
      },
    });

    return plainToInstance(TrandkeywordDTO, trandKeywords, {
      excludeExtraneousValues: true,
    });
  }

  // 데이터를 삭제하고 트렌드 키워드를 데이터베이스에 저장하는 함수
  private async deleteTrandKeywordsForToday(platform: string) {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
    const startOfDay = new Date(currentDate + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate + 'T23:59:59.999Z');

    // 같은 날짜와 플랫폼의 데이터를 삭제
    await this.trandKeywordRepository
      .createQueryBuilder()
      .delete()
      .where(
        'createdAt >= :startOfDay AND createdAt <= :endOfDay AND platform = :platform',
        {
          startOfDay,
          endOfDay,
          platform,
        },
      )
      .execute();
  }

  async getTrandKeywordWithNate() {
    const url = 'https://m.nate.com/';

    try {
      // Nate 페이지 HTML 요청
      const response = await axios.get(url);
      const html = response.data;

      // cheerio로 HTML 파싱
      const $ = cheerio.load(html);

      // 트렌드 키워드를 추출할 요소 찾기
      const posts = $('ol.rankList li');

      // 추출된 트렌드 키워드 처리
      const topKeywords = [];
      posts.each((index, element) => {
        const text = $(element).text().trim();

        // 정규식을 이용하여 숫자(순위)와 텍스트(키워드) 분리
        const match = text.match(/^(\d+)(.*)$/);
        if (match) {
          const rank = index + 1;
          const keyword = match[2].trim(); // 나머지 키워드 추출

          if (keyword) {
            topKeywords.push({ rank, keyword });
          }
        }
      });

      // 플랫폼별로 삭제
      await this.deleteTrandKeywordsForToday('NATE');

      // 트렌드 키워드를 데이터베이스에 저장
      const today = new Date();
      for (const keyword of topKeywords) {
        const trandKeyword = this.trandKeywordRepository.create({
          keyword: keyword.keyword,
          rank: keyword.rank,
          platform: 'NATE',
          createdAt: today,
        });

        // 키워드 저장
        await this.trandKeywordRepository.save(trandKeyword);
      }

      console.log('Top keywords from Nate saved to the database.');
    } catch (error) {
      console.error('Error fetching data from Nate:', error);
    }
  }

  async getTrandKeywordWithZum() {
    const url = 'https://zum.com/';

    try {
      // Zum 페이지 HTML 요청
      const response = await axios.get(url);
      const html = response.data;

      // 정규식으로 window.__INITIAL_STATE__ 값 추출
      const match = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*\});/);

      if (match) {
        // 추출된 JSON 문자열을 객체로 파싱
        const initialState = JSON.parse(match[1]);

        // 트렌드 키워드 가져오기 (최대 10개)
        const top10Keywords = initialState.headerStore.issueWord.items.slice(
          0,
          10,
        );

        // 플랫폼별로 삭제
        await this.deleteTrandKeywordsForToday('ZUM');

        // 오늘 날짜 범위 계산 (2024-12-08 형태)
        const today = new Date();

        // 트렌드 키워드를 데이터베이스에 저장
        let rank = 1;
        for (const keyword of top10Keywords) {
          const trandKeyword = this.trandKeywordRepository.create({
            keyword: keyword[0],
            rank: rank,
            platform: 'ZUM',
            createdAt: today,
          });

          rank++;

          // 키워드 저장
          await this.trandKeywordRepository.save(trandKeyword);
        }

        console.log('Top 10 keywords from Zum saved to the database.');
      } else {
        console.log('window.__INITIAL_STATE__ not found in the HTML.');
      }
    } catch (error) {
      console.error('Error fetching data from Zum:', error);
    }
  }

  async getTrandKeywordWithNaver() {
    const url = 'https://api.signal.bz/news/realtime';
    try {
      // API에서 데이터 가져오기
      const res = await axios.get(url);
      const top10 = res.data.top10;

      // 플랫폼별로 삭제
      await this.deleteTrandKeywordsForToday('NAVER');

      // 오늘 날짜 범위 계산 (2024-12-08 형태)
      const today = new Date();

      // 받은 데이터에서 각 트렌드 키워드를 저장
      for (const item of top10) {
        const { rank, keyword } = item;

        // 트렌드 키워드 엔티티를 생성하여 DB에 저장
        const trandKeyword = this.trandKeywordRepository.create({
          rank,
          keyword,
          platform: 'NAVER',
          createdAt: today, // 자동으로 현재 시간 설정
        });

        // 트렌드 키워드를 DB에 저장
        await this.trandKeywordRepository.save(trandKeyword);
      }

      console.log('Top 10 keywords from Naver saved to the database.');
    } catch (error) {
      console.error('Error fetching data from the API:', error);
    }
  }
}
