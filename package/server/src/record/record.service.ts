import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';

@Injectable()
export class RecordsService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async create(record: Partial<Record>) {
    return this.recordModel.create(record);
  }

  async findAll() {
    return this.recordModel.find().exec();
  }

  // 添加做题记录
  async addRecord(dto: {
    topicTitle: string;
    durationSec: number;
    topicId: number;
    isCorrect: boolean;
  }) {
    const record = new this.recordModel({
      topic_title: dto.topicTitle,
      duration_sec: dto.durationSec,
      submit_time: new Date(),
      topic_id: dto.topicId,
      is_correct: dto.isCorrect,
    });
    return record.save();
  }
}
