import { Controller, Get, Query } from '@nestjs/common';
import { DeepSeekService } from './deepseek.service';

@Controller('api/ai')
export class DeepSeekController {
  constructor(private readonly deepSeekService: DeepSeekService) {}

  @Get('compare')
  async askQuestion(
    @Query('recent') recent: string,
    @Query('right') right: string,
    @Query('title') title: string,
  ) {
    return this.deepSeekService.compare({ recent, right, title });
  }
}
