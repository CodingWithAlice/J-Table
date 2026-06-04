import { Controller, Get, Query } from '@nestjs/common';
import { CoinService } from './coin.service';

@Controller('api/coin')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get('total')
  async getTotal() {
    const total = await this.coinService.getTotalCoins();
    return { data: total };
  }

  @Get('daily')
  async getDaily(@Query() query: { startDate?: string; endDate?: string }) {
    const data = await this.coinService.getDailyCoins(
      query.startDate,
      query.endDate,
    );
    return { data };
  }

  @Get('trend')
  async getTrend(@Query() query: { days?: number }) {
    const days = query.days ? parseInt(query.days.toString(), 10) : 30;
    const data = await this.coinService.getTrendData(days);
    return { data };
  }
}

