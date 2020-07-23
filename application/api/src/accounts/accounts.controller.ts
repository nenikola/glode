import { Controller, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('login')
  async login(
    @Query('username') username: string,
    @Query('password') password: string,
    @Query('orgID') orgID: string,
  ) {
    return await this.accountsService.login(username, password, orgID);
  }
}
