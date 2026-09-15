import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coin } from '../models/coin.model';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { getStreakStatusForDate } from './coin-streak.util';

@Injectable()
export class CoinService {
  constructor(
    @InjectModel(Coin)
    private coinModel: typeof Coin,
  ) {}

  // 添加金币（按日期累加，入账时乘连续学习倍率）
  async addCoins(date: string, coins: number): Promise<number> {
    if (!coins || coins <= 0) {
      return 0;
    }

    const normalizedDate = dayjs(date).format('YYYY-MM-DD');
    const awarded = coins * (await this.getStreakMultiplier(normalizedDate));
    
    const [coin, created] = await this.coinModel.findOrCreate({
      where: { date: normalizedDate },
      defaults: { date: normalizedDate, coins: 0 },
    });

    if (!created) {
      await coin.increment('coins', { by: awarded });
    } else {
      await coin.update({ coins: awarded });
    }

    return awarded;
  }

  private async getStreakMultiplier(date: string): Promise<number> {
    const yesterday = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
    const dayBefore = dayjs(date).subtract(2, 'day').format('YYYY-MM-DD');
    const rows = await this.coinModel.findAll({
      where: { date: { [Op.in]: [yesterday, dayBefore] } },
      attributes: ['date', 'coins'],
      raw: true,
    });
    return getStreakStatusForDate(rows, date).multiplier;
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

