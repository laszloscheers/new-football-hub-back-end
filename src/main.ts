import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enabling CORS with specific options  depending on the environment
  app.enableCors({
    origin: configService.get<string>(process.env.FRONT_END_URL),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  });

  // Using global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Configuring Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Football Hub API')
    .setDescription('Football API description')
    .setVersion('1.0')
    .addBearerAuth() // Adding Bearer authentication for documentation so token can be added
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Starting the application with port depending on the environment
  await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
