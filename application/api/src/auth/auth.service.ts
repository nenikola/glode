import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    username: string,
    pass: string,
    orgID: string,
  ): Promise<any> {
    const user = await this.accountsService.login(username, pass, orgID);
    return user;
  }
  async login(user: any) {
    const payload = { username: user.username, orgID: user.orgID };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
