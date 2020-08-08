import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'glode-secret',
    });
  }

  async validate(payload: any) {
    return {
      orgID: payload.orgID,
      identityOptions: await this.accountsService.getUsersIdentityAndWallet(
        payload.username,
        payload.orgID,
      ),
    };
  }
}
