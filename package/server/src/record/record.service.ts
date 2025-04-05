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
    questionTitle: string;
    durationSec: number;
    questionId: number;
    isCorrect: boolean;
  }) {
    const record = new this.recordModel({
      question_title: dto.questionTitle,
      duration_sec: dto.durationSec,
      submit_time: new Date(),
      question_id: dto.questionId,
      is_correct: dto.isCorrect,
    });
    return record.save();
  }
}
