import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coin } from '../models/coin.model';
import { YearPlanItem } from '../models/year-plan-item.model';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';

@Module({
  controllers: [CoinController],
  providers: [CoinService],
  imports: [SequelizeModule.forFeature([Coin, YearPlanItem])],
  exports: [CoinService],
})
export class CoinModule {}

