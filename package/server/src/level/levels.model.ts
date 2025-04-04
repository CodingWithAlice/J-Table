import { Level } from './../models/level.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LevelService } from './levels.service';
import { LevelController } from './levels.controller';

@Module({
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
  imports: [SequelizeModule.forFeature([Level])],
})
export class LevelsModule {}
