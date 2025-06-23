import { BooksRecord } from '../models/books-record.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BooksRecordService {
  constructor(
    @InjectModel(BooksRecord)
    private booksRecordModel: typeof BooksRecord,
  ) {}

  async findAll(): Promise<any> {
    const booksRecords = await this.booksRecordModel.findAll();
    return { data: booksRecords };
  }

  findOne(id: string): Promise<BooksRecord> {
    return this.booksRecordModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const booksRecord = await this.findOne(id);
    await booksRecord.destroy();
  }
}
