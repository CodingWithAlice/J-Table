import { AuthGuard } from 'src/auth.guard';
import { RecordsService } from './record.service';
import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';

@Controller('api/record')
export class RecordController {
  constructor(private readonly recordService: RecordsService) {}

  @Get()
  findAll(@Query() params) {
    return this.recordService.findOne(params);
  }

  @Get('by-date')
  findByDate(@Query() params) {
    return this.recordService.findByDate(params);
  }

  @Get('last')
  findLastWrong() {
    return this.recordService.findLastWrong();
  }

  @Post('update')
  @UseGuards(AuthGuard)
  updateRecord(@Body() data) {
    return this.recordService.updateRecord(data);
  }
}
