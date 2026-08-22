import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth.guard';
import { DeepSeekService } from './deepseek.service';

@Controller('api/ai')
@UseGuards(AuthGuard)
export class DeepSeekController {
  constructor(private readonly deepSeekService: DeepSeekService) {}

  @Post('compare')
  async askQuestion(
    @Req() req: Request,
    @Body()
    body: {
      recent?: string;
      right?: string;
      title?: string;
      pro?: boolean;
    },
  ) {
    const clientKey =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    try {
      this.deepSeekService.assertRateLimit(clientKey);
    } catch (e) {
      throw new HttpException(
        e instanceof Error ? e.message : '请求过于频繁',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const recent = typeof body?.recent === 'string' ? body.recent : '';
    const right = typeof body?.right === 'string' ? body.right : '';
    const title = typeof body?.title === 'string' ? body.title : '';

    if (!title.trim() && !recent.trim()) {
      throw new HttpException('参数不完整', HttpStatus.BAD_REQUEST);
    }

    // 限制单次 payload，降低被滥用刷 token 的风险
    const maxLen = 8000;
    if (recent.length > maxLen || right.length > maxLen || title.length > 500) {
      throw new HttpException('内容过长', HttpStatus.BAD_REQUEST);
    }

    return this.deepSeekService.compare({
      recent,
      right,
      title,
      usePro: Boolean(body?.pro),
    });
  }
}
