import { RecordsService } from './record.service';
import { Controller, Get, Post, Patch, Query, Body } from '@nestjs/common';

@Controller('api/record')
export class RecordController {
  constructor(private readonly recordService: RecordsService) {}

  @Get()
  findAll(@Query() params) {
    return this.recordService.findOne(params);
  }

  @Post('add')
  addRecord(@Body() data) {
    return this.recordService.addRecord(data);
  }

  @Patch('update')
  updateRecord(@Body() data) {
    return this.recordService.updateRecord(data);
  }
}
