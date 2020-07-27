import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [BookingsModule, AccountsModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
