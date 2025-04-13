import { RecordsService } from './record.service';
import { Controller, Get, Post, Query, Body } from '@nestjs/common';

@Controller('api/record')
export class RecordController {
  constructor(private readonly recordService: RecordsService) {}

  @Get()
  findAll(@Query() params) {
    return this.recordService.findOne(params);
  }

  @Post('update')
  updateRecord(@Body() data) {
    return this.recordService.updateRecord(data);
  }
}
