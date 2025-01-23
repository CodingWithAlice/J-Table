import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Routine } from 'src/models/routine.model';
import { RoutineService } from './routines.service';
import { RoutineController } from './routines.controller';

@Module({
  imports: [SequelizeModule.forFeature([Routine])],
  providers: [RoutineService],
  controllers: [RoutineController],
})
export class RoutinesModule {}
