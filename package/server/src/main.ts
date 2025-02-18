import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    // 配置 CORS 选项
    origin: 'http://localhost:4001', // 允许来自 4001 端口的请求
    methods: 'GET,PUT,PATCH,POST',
    // credentials: true,
  };
  app.enableCors(corsOptions);
  // 设置后端项目的端口号为4002
  await app.listen(process.env.PORT ?? 4002);
}
bootstrap();
