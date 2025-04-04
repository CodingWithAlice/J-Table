import { Controller, Get } from '@nestjs/common';
import { LevelService } from './levels.service';

@Controller('api/level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.levelService.findAll();
  }
}
