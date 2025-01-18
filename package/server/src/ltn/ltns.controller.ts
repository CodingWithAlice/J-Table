import { Controller, Get } from '@nestjs/common';
import { LtnService } from './ltns.service';

@Controller('ltn')
export class LtnController {
  constructor(private readonly ltnService: LtnService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.ltnService.findAll();
  }
}
