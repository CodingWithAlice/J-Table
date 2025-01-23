import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LtnsModule } from './ltn/ltns.model';
import { Ltn } from './models/ltn.model';
import { Routine } from './models/routine.model';
import { RoutinesModule } from './routine/routines.model';
import { Time } from './models/time.model';
import { TimesModule } from './time/times.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'localhost',
      database: 'Daily',
      models: [Ltn, Routine, Time],
    }),
    LtnsModule,
    RoutinesModule,
    TimesModule,
  ],
})
export class AppModule {}
