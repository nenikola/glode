import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransfersModule } from './transfers/transfers.module';
import { TransferEquipmentModule } from './transfer-equipment/transfer-equipment.module';

@Module({
  imports: [BookingsModule, AccountsModule, TransfersModule, TransferEquipmentModule],
  controllers: [AppController],
  providers: [AppService,],
  exports:[AppService,AccountsModule]
})
@Global()
export class AppModule {}
