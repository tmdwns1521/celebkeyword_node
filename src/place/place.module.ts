import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceSingle } from './entities/place.single.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceSingle, User]), UserModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
