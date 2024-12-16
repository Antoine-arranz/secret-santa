import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Pour permettre les requêtes depuis le frontend
  await app.listen(3000);
}
bootstrap();
