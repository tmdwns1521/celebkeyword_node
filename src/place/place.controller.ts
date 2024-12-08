import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceRankDto } from './dto/place-rank.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('places')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  @Delete('/place-rank/singles')
  @UseGuards(JwtAuthGuard)
  async removePlaceRank(
    @Query('id') id: string, // URL 쿼리 파라미터로 `id` 값 수신
    @Req() req: Request,
  ): Promise<{ result: void; ResponseMSG: string }> {
    const user: User = req.user as User; // JWT에서 인증된 사용자 정보 가져오기
    const result = await this.placeService.removePlaceRank(user, id);
    return { ResponseMSG: '성공', result };
  }

  @Post('/place-rank/singles')
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to protect this route
  async getPlaceRanking(
    @Body() placeRankDto: PlaceRankDto,
    @Req() req: Request, // Access the request object
  ): Promise<any> {
    const user = req.user as User;
    const isSinglePlace = await this.userService.checkSinglePlace(user);
    if (!isSinglePlace) return { ResponseMSG: '현재 조회가 불가 합니다.' };
    const result = await this.placeService.getPlaceRanking(placeRankDto);
    if (typeof result !== 'number' && result?.rank === -1) {
      return { ResponseMSG: '조회가 되지 않습니다.' };
    }
    console.log('getPlaceRanking-result ::: ', result);
    const summaryData = await this.placeService.getSummary(
      placeRankDto.placeNumber,
    );
    console.log('summaryData', summaryData);
    await this.placeService.setSingleRank(
      user,
      placeRankDto,
      result,
      summaryData,
    );
    return { ResponseMSG: '성공', result };
  }

  @Get('/place-rank/singles')
  @UseGuards(JwtAuthGuard)
  async getPlaceSingleRankingByUser(@Req() req: Request) {
    const user = req.user as User;
    return await this.placeService.getPlaceSingleRankingByUser(user);
  }
}
