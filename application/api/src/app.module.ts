import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [BookingsModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
