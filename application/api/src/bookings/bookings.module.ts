import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AccountsService } from '../accounts/accounts.service';
import { AppService } from 'src/app.service';

@Module({
  providers: [BookingsService, AccountsService, AppService],
  controllers: [BookingsController],
})
export class BookingsModule {}
