import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { APP_JWT_SECRET, APP_JWT_EXPIRATION_TIME } from '../../configs';
import { AuthGuard, RolesGuard } from '../../common/guards';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configs: ConfigService) => ({
        secret: configs.get<string>(APP_JWT_SECRET),
        signOptions: {
          expiresIn: configs.get<string>(APP_JWT_EXPIRATION_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
