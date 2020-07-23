import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [BookingsService, AppService],
  controllers: [BookingsController],
})
export class BookingsModule {}
