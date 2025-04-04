import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';
import { LtnController } from './ltns.controller';
import { LtnService } from './ltns.service';
import { LevelsModule } from 'src/level/levels.model';

@Module({
  controllers: [LtnController],
  providers: [LtnService],
  imports: [SequelizeModule.forFeature([Ltn]), LevelsModule],
})
export class LtnsModule {}
