import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { LtnService } from './ltns.service';

@Controller('api/ltn')
export class LtnController {
  constructor(private readonly ltnService: LtnService) {}

  @Get()
  findAll(@Query() query): Promise<any[]> {
    return this.ltnService.findAll(query);
  }

  @Patch('operate')
  update(@Body() { id, type, time }) {
    if (!id || !type || !time) {
      throw new Error('参数错误');
    }
    return this.ltnService.updateBoxId(id, type, time);
  }
}
