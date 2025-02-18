import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LtnsModule } from './ltn/ltns.model';
import { Ltn } from './models/ltn.model';
import { Routine } from './models/routine.model';
import { RoutinesModule } from './routine/routines.model';
import { Time } from './models/time.model';
import { TimesModule } from './time/times.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // 使 ConfigModule 在整个应用中可用
    }),
    SequelizeModule.forRootAsync({
      // 使用异步方式配置 Sequelize，这样可以在配置过程中注入 ConfigService 来获取环境变量
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: 3306,
        username: 'root',
        password: configService.get<string>('DB_PASSWORD'),
        database: 'Daily',
        models: [Ltn, Routine, Time],
      }),
      inject: [ConfigService],
    }),
    LtnsModule,
    RoutinesModule,
    TimesModule,
  ],
})
export class AppModule {}
