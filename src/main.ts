import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "https://football-hub.212-227-83-162.plesk.page/",
    methods: 'GET,HEAD,PUT,PATCH,POST,DeLETE,OPTIONS',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });
  await app.listen(3000);
}

bootstrap();
