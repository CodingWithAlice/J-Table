import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';
import { LtnController } from './ltns.controller';
import { LtnService } from './ltns.service';
import { LevelsModule } from 'src/level/levels.model';
import { CoinModule } from 'src/coin/coin.module';

@Module({
  controllers: [LtnController],
  providers: [LtnService],
  imports: [SequelizeModule.forFeature([Ltn]), LevelsModule, CoinModule],
  exports: [LtnService],
})
export class LtnsModule {}
