import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { PlaceService } from './place.service';
import { PlaceRankDto } from './dto/place-rank.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('/place-rank/singles')
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to protect this route
  async getPlaceRanking(
    @Body() placeRankDto: PlaceRankDto,
    @Req() req: Request, // Access the request object
  ): Promise<any> {
    const user = req.user as User;
    const result = await this.placeService.getPlaceRanking(placeRankDto);
    console.log('getPlaceRanking-result ::: ', result);
    await this.placeService.setSingleRank(user, placeRankDto, result);
    return result;
  }

  @Get('/place-rank/singles')
  @UseGuards(JwtAuthGuard)
  async getPlaceSingleRankingByUser(@Req() req: Request) {
    const user = req.user as User;
    return await this.placeService.getPlaceSingleRankingByUser(user);
  }
}
