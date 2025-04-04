import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Time } from 'src/models/time.model';
import { TimeService } from './times.service';
import { TimeController } from './times.controller';
import { Routine } from 'src/models/routine.model';

@Module({
  controllers: [TimeController],
  providers: [TimeService],
  imports: [SequelizeModule.forFeature([Time, Routine])],
})
export class TimesModule {}
