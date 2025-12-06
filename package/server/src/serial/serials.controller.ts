import { Controller, Get } from '@nestjs/common';
import { SerialService } from './serials.service';

@Controller('api/serial')
export class SerialController {
  constructor(private readonly serialService: SerialService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.serialService.findAll();
  }
}
