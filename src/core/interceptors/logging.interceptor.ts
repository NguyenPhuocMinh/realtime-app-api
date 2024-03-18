import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger(LoggingInterceptor.name);

    logger.verbose('Before log request...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => logger.verbose(`After log request... ${Date.now() - now}ms`)),
      );
  }
}
