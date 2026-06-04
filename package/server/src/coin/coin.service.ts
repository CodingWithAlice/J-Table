import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coin } from '../models/coin.model';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

@Injectable()
export class CoinService {
  constructor(
    @InjectModel(Coin)
    private coinModel: typeof Coin,
  ) {}

  // 添加金币（按日期累加）
  async addCoins(date: string, coins: number): Promise<void> {
    const normalizedDate = dayjs(date).format('YYYY-MM-DD');
    
    const [coin, created] = await this.coinModel.findOrCreate({
      where: { date: normalizedDate },
      defaults: { date: normalizedDate, coins: 0 },
    });

    if (!created) {
      await coin.increment('coins', { by: coins });
    } else {
      await coin.update({ coins });
    }
  }

  // 获取总金币数
  async getTotalCoins(): Promise<number> {
    const result = await this.coinModel.sum('coins');
    return result || 0;
  }

  // 获取每日金币列表
  async getDailyCoins(startDate?: string, endDate?: string): Promise<Coin[]> {
    const where: any = {};
    
    if (startDate) {
      where.date = {
        ...where.date,
        [Op.gte]: dayjs(startDate).format('YYYY-MM-DD'),
      };
    }
    
    if (endDate) {
      where.date = {
        ...where.date,
        [Op.lte]: dayjs(endDate).format('YYYY-MM-DD'),
      };
    }

    return this.coinModel.findAll({
      where: Object.keys(where).length > 0 ? where : undefined,
      order: [['date', 'ASC']],
      raw: true,
    });
  }

  // 获取趋势数据（默认最近 30 天）
  async getTrendData(days: number = 30): Promise<Coin[]> {
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD');
    
    return this.getDailyCoins(startDate, endDate);
  }
}

