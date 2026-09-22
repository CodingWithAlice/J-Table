import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import dotenv from 'dotenv';
import dns from 'node:dns';
import path from 'path';

// Node 17+ 默认把 localhost 解析成 ::1，MySQL 通常只监听 IPv4，会变成 ECONNREFUSED ::1:3306
dns.setDefaultResultOrder('ipv4first');

// Docker 把宿主机 config.env 挂到 /config.env；本地则读仓库上一级的 config.env
dotenv.config({ path: '/config.env' });
dotenv.config({ path: path.resolve(__dirname, '../../../../config.env') });
// 本地 .env.* 覆盖共享 config，避免开发时连上线上库
dotenv.config({
  path: path.resolve(
    __dirname,
    `../.env.${process.env.NODE_ENV || 'development'}`,
  ),
  override: true,
});
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

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
