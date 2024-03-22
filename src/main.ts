import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
// App module
import { AppModule } from './app.module';
// configs
import { APP_PORT, APP_CLIENT_URL } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // configs
  const configs = app.get(ConfigService);
  const appPort = configs.get<string>(APP_PORT);
  const appClientUrl = configs.get<string>(APP_CLIENT_URL);

  // prefix
  app.setGlobalPrefix('api');
  // cookie
  app.use(cookieParser());
  // validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // core
  app.enableCors({ origin: [appClientUrl], credentials: true });
  // documents
  const options = new DocumentBuilder()
    .setTitle('Rest Api ChatApp')
    .setDescription('The ChatApp API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // listen
  await app.listen(appPort);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
