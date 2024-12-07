import { Controller, Get } from '@nestjs/common';
import { TrandkeywordsService } from './trandkeywords.service';

@Controller('trandkeywords')
export class TrandkeywordsController {
  constructor(private readonly trandkeywordsService: TrandkeywordsService) {}

  @Get()
  findAll() {
    return this.trandkeywordsService.getTrandKeywordAll();
  }
}
