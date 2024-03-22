import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PublicDecorator } from './common/decorators';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicDecorator()
  @Get()
  @ApiTags('home')
  getHello(): string {
    return this.appService.getHello();
  }
}
