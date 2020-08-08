import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class GlodeStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const user = await this.authService.validateUser(
      req.body.username,
      req.body.password,
      req.body.orgID,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
