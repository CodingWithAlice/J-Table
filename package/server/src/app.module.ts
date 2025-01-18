import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LtnsModule } from './ltn/ltns.model';
import { Ltn } from './models/ltn.model';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'localhost',
      database: 'JTable',
      models: [Ltn],
    }),
    LtnsModule,
  ],
})
export class AppModule {}
