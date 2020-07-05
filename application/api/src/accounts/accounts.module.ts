import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AppService],
})
export class AccountsModule {}
