import { Body, Controller, Get, Patch } from '@nestjs/common';
import { LtnService } from './ltns.service';

@Controller('ltn')
export class LtnController {
  constructor(private readonly ltnService: LtnService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.ltnService.findAll();
  }

  @Patch('operate')
  update(@Body() { id, type, time }) {
    if (!id || !type || !time) {
      throw new Error('参数错误');
    }
    return this.ltnService.updateBoxId(id, type, time);
  }
}
