import { Controller, Get } from '@nestjs/common';
import { TimeService } from './times.service';

export interface RoutineItem {
  des: string;
  routineType: string;
  serialNumber: number | null;
  duration: number | null;
  routineTypeId: string | number;
  date: Date;
}

@Controller('api/time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get()
  findAll(): Promise<RoutineItem[]> {
    return this.timeService.findAll();
  }
}
