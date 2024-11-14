import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceRankDto } from './dto/place-rank.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from "../user/entities/user.entity";

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('/place-rank/single')
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to protect this route
  async getPlaceRanking(
    @Body() placeRankDto: PlaceRankDto,
    @Req() req: Request, // Access the request object
  ): Promise<any> {
    const user = req.user as User;
    const result = await this.placeService.getPlaceRanking(placeRankDto);
    await this.placeService.setSingleRank(user, placeRankDto, result);
    return result;
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(+id, updatePlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(+id);
  }
}
