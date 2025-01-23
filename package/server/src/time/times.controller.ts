import { Controller, Get } from '@nestjs/common';
import { TimeService } from './times.service';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.timeService.findAll();
  }
}
