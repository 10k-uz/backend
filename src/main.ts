import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error-handler';
import * as morgan from 'morgan';

async function bootstrap() {
  // creating app
  const app = await NestFactory.create(AppModule);

  // prefix router
  app.setGlobalPrefix('api/v1');

  // auto validation
  app.useGlobalPipes(new ValidationPipe());

  // cors
  app.enableCors();

  // cookie parser
  app.use(cookieParser());

  // morgan for logging
  app.use(
    morgan('common', {
      immediate: true,
    }),
  );

  // error handler
  app.use(errorHandler);

  // working port
  await app.listen(3001);
}

bootstrap();
