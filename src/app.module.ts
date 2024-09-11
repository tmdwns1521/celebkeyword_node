import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [PlaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
