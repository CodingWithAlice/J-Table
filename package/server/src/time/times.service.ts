import { Time } from './../models/time.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { BooksRecord } from 'src/models/books-record.model';
import { Routine } from 'src/models/routine.model';
import { Serial } from 'src/models/serial.model';
import { RoutineItem } from './times.controller';

@Injectable()
export class TimeService {
  constructor(
    @InjectModel(Time)
    private timeModel: typeof Time,

    @InjectModel(Routine)
    private readonly routineModel: typeof Routine,

    @InjectModel(Serial)
    private serialModel: typeof Serial,

    @InjectModel(BooksRecord)
    private booksRecordModel: typeof BooksRecord,
  ) {}

  private calculateDuration(start: Date, end: Date): number {
    return dayjs(end).diff(dayjs(start), 'day');
  }

  private transformSerialData(serial: Serial): RoutineItem {
    return {
      des: serial.spool || '', // 假设sport字段对应des
      routineType: 'LTN',
      serialNumber: serial.serialNumber,
      duration: this.calculateDuration(serial.startTime, serial.endTime),
      routineTypeId: 6,
      date: serial.startTime,
    };
  }

  private transformBookData(
    book: BooksRecord,
    routineType: string,
    routineTypeId: number,
  ): RoutineItem {
    return {
      des: `${book.tag || ''} ${book.title || ''}`.trim(),
      routineType,
      serialNumber: null,
      duration: null,
      routineTypeId,
      date: book.recent,
    };
  }

  private transformTimeData(
    time: Time,
    routineType: string,
    routineTypeId: number,
  ): RoutineItem {
    return {
      des: time.des,
      routineType,
      serialNumber: null,
      duration: time.duration,
      routineTypeId,
      date: time.date,
    };
  }

  async findAll(): Promise<any> {
    // 获取所有的 routineType
    const routineTypes = await this.routineModel.findAll();
    const routineTypeByIds = routineTypes.reduce((pre, cur) => {
      pre[cur.des] = {
        type: cur.type,
        id: cur.id,
      };
      pre[cur.id] = cur.type;
      return pre;
    }, {});

    // 并行查询三张表
    const [serialData, booksData, timesData] = await Promise.all([
      this.serialModel.findAll(),
      this.booksRecordModel.findAll(),
      this.timeModel.findAll(),
    ]);

    // 转换数据结构
    const transformedSerials = serialData
      .map(this.transformSerialData.bind(this))
      .filter((it: RoutineItem) => it.des);
    const transformedBooks = booksData.map((it) =>
      this.transformBookData(
        it,
        routineTypeByIds?.[it.tag]?.type || 'movie',
        routineTypeByIds?.[it.tag]?.id || 1,
      ),
    );

    const transformedTimes = timesData.map((it) =>
      this.transformTimeData(
        it,
        routineTypeByIds?.[`${it.routineTypeId}`] || 'movie',
        it.routineTypeId,
      ),
    );

    return {
      data: [
        ...transformedSerials,
        ...transformedBooks,
        ...transformedTimes,
      ].sort((a: RoutineItem, b: RoutineItem) =>
        dayjs(a.date).isBefore(b.date) ? 1 : -1,
      ),
    };
  }

  findOne(id: string): Promise<Time> {
    return this.timeModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const time = await this.findOne(id);
    await time.destroy();
  }
}
