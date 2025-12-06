import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksRecord } from 'src/models/books-record.model';
import { BooksRecordService } from './books-record.service';
import { BooksRecordController } from './books-record.controller';

@Module({
  controllers: [BooksRecordController],
  providers: [BooksRecordService],
  imports: [SequelizeModule.forFeature([BooksRecord])],
})
export class BooksRecordModule {}
