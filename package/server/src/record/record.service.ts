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

  async findOne({ topic_id }: { topic_id: number }) {
    return this.recordModel.findOne({ topic_id }).exec();
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

  // 修改记录信息
  async updateRecord(dto: {
    topicTitle: string;
    durationSec: number;
    topicId: number;
    isCorrect: boolean;
  }) {
    return this.recordModel
      .findOneAndUpdate(
        { topic_id: dto.topicId },
        {
          $set: {
            topic_title: dto.topicTitle,
            duration_sec: dto.durationSec,
            submit_time: new Date(),
            topic_id: dto.topicId,
            is_correct: dto.isCorrect,
          },
        },
        { new: true }, // 返回更新后的文档
      )
      .exec();
  }
}
