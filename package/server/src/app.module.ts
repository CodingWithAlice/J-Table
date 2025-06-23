import { AnswersModule } from './answer/answer.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LtnsModule } from './ltn/ltns.module';
import { Ltn } from './models/ltn.model';
import { Routine } from './models/routine.model';
import { Level } from './models/level.model';
import { RoutinesModule } from './routine/routines.module';
import { Time } from './models/time.model';
import { TimesModule } from './time/times.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LevelsModule } from './level/levels.model';
import { RecordsModule } from './record/record.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Serial } from './models/serial.model';
import { SerialModule } from './serial/serials.module';
import { BooksRecord } from './models/books-record.model';
import { BooksRecordModule } from './books-record/books-record.module';

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
        models: [Ltn, Routine, Time, Level, Serial, BooksRecord],
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // 明确声明依赖
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'), // 从环境变量获取
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    LtnsModule,
    RoutinesModule,
    SerialModule,
    BooksRecordModule,
    TimesModule,
    LevelsModule,
    AnswersModule,
    RecordsModule,
  ],
})
export class AppModule {}
