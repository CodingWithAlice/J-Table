import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,PATCH,POST',
    // credentials: true,
  };
  app.enableCors(corsOptions);
  // 设置后端项目的端口号为3002
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
