import { Test, TestingModule } from '@nestjs/testing';
import { TrandkeywordsController } from './trandkeywords.controller';
import { TrandkeywordsService } from './trandkeywords.service';

describe('TrandkeywordsController', () => {
  let controller: TrandkeywordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrandkeywordsController],
      providers: [TrandkeywordsService],
    }).compile();

    controller = module.get<TrandkeywordsController>(TrandkeywordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
