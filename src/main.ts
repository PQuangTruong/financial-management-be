import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      //add more domains
    ],
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  //Middleware
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.setGlobalPrefix('/api/v2', { exclude: [''] });
  await app.listen(port);
}
bootstrap();
