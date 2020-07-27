import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { AccountsService } from '../accounts/accounts.service';
import { AppService } from '../app.service';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, AccountsService, AppService],
})
export class TransfersModule {}
