import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Time } from 'src/models/time.model';
import { TimeService } from './times.service';
import { TimeController } from './times.controller';

@Module({
  imports: [SequelizeModule.forFeature([Time])],
  providers: [TimeService],
  controllers: [TimeController],
})
export class TimesModule {}
