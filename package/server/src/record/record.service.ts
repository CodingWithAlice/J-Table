import { LtnService } from 'src/ltn/ltns.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';
import dayjs from 'dayjs';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private recordModel: Model<Record>,
    private readonly ltnService: LtnService,
  ) {}

  async create(record: Partial<Record>) {
    return this.recordModel.create(record);
  }

  async findOne({ topicId }: { topicId: string }) {
    // 是否展示正确答案
    const topicInfo = await this.ltnService.findOne(+topicId);
    const solveTime = topicInfo?.solveTime;
    const customDuration = topicInfo?.customDuration;
    const showRightAnswer = dayjs().isBefore(
      dayjs(solveTime).add(customDuration, 'days'),
    );

    const record = await this.recordModel.find({ topic_id: +topicId }).exec();
    return { data: { showRightAnswer, record: record?.[0] || {} } };
  }

  // 修改记录信息
  async updateRecord(dto: {
    topicId: number;
    topicTitle: string;
    durationSec?: number;
    isCorrect?: boolean;
    recentAnswer?: string;
  }) {
    return this.recordModel
      .findOneAndUpdate(
        { topic_id: dto.topicId },
        {
          $set: {
            topic_title: dto.topicTitle,
            duration_sec: dto.durationSec,
            topic_id: dto.topicId,
            is_correct: dto.isCorrect,
            recent_answer: dto.recentAnswer,
          },
        },
        {
          new: true, // 返回更新后的文档
          upsert: true, // 如果不存在则创建
          setDefaultsOnInsert: true, // 如果创建，应用 schema 默认值
        },
      )
      .exec();
  }
}
