import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnv } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ConfigEnv.PORT || 3000);
}
bootstrap();
