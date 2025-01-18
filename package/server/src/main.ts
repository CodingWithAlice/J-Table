import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置后端项目的端口号为3002
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
