import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import dotenv from 'dotenv';
import path from 'path';

// 先加载线上配置
dotenv.config({ path: path.resolve(__dirname, '../../../../config.env') });
// 再加载本地配置（如果有会覆盖线上配置）
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    // 配置 CORS 选项
    origin: ['http://localhost:4001', 'http://codingwithalice.top:4001'], // 允许来自 4001 端口的请求
    methods: 'GET,PUT,PATCH,POST',
    // credentials: true,
  };
  app.enableCors(corsOptions);
  // 设置后端项目的端口号为4002
  await app.listen(4002, '0.0.0.0'); // 监听所有可用网络接口
}
bootstrap();
