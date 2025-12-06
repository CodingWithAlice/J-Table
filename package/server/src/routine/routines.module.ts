import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Routine } from 'src/models/routine.model';
import { RoutineService } from './routines.service';
import { RoutineController } from './routines.controller';

@Module({
  controllers: [RoutineController],
  providers: [RoutineService],
  imports: [SequelizeModule.forFeature([Routine])],
})
export class RoutinesModule {}
