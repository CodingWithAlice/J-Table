import { Controller, Get } from '@nestjs/common';
import { BooksRecordService } from './books-record.service';

@Controller('api/books-record')
export class BooksRecordController {
  constructor(private readonly booksRecordService: BooksRecordService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.booksRecordService.findAll();
  }
}
