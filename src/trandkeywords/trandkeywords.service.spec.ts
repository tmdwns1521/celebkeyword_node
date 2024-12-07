import { Test, TestingModule } from '@nestjs/testing';
import { TrandkeywordsService } from './trandkeywords.service';

describe('TrandkeywordsService', () => {
  let service: TrandkeywordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrandkeywordsService],
    }).compile();

    service = module.get<TrandkeywordsService>(TrandkeywordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
