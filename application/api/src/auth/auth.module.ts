import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GlodeStrategy } from './glode.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'glode-secret',
    }),
  ],
  providers: [AuthService, GlodeStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
