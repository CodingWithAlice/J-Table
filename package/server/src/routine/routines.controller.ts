import { Controller, Get } from '@nestjs/common';
import { RoutineService } from './routines.service';

@Controller('api/routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.routineService.findAll();
  }
}
