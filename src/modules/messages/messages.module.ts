import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from '../../database/database.module';

import { AuthGuard, RolesGuard } from '../../common/guards';

@Module({
  imports: [DatabaseModule],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
