import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { isEmpty } from 'lodash';

import { APP_JWT_SECRET } from '../../configs';
import { IS_PUBLIC_KEY, AUTHORIZATION_KEY } from '../../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromCookie(request);

    if (isEmpty(token)) {
      this.logger.error('[AuthGuard] Token Not Found....');
      throw new UnauthorizedException('Token Not Found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(APP_JWT_SECRET),
      });
      request['userRequest'] = payload;
    } catch (error) {
      this.logger.error('[AuthGuard] has been error....', error.message);
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    console.log("🚀 ~ AuthGuard ~ extractTokenFromCookie ~ request:", request)
    const token = request.cookies[AUTHORIZATION_KEY];
    return token;
  }
}
