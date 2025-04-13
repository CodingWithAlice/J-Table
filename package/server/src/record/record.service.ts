import { LtnService } from 'src/ltn/ltns.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';
import dayjs from 'dayjs';
import { AnswersService } from 'src/answer/answer.service';

interface RecordDTO {
  topicId: number;
  topicTitle?: string;
  recentAnswer?: string;
  durationSec?: number;
  submitTime: string;
  solveTime?: string;
  isCorrect?: boolean;
}

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private recordModel: Model<Record>,
    private readonly ltnService: LtnService,
    private readonly answersService: AnswersService,
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

    const record = await this.recordModel
      .find({ topicId: +topicId })
      .select('-_id') // 排除 _id 字段
      .lean();
    const rightAnswer = await this.answersService.findOne({ topicId });
    return {
      data: {
        showRightAnswer,
        record: { ...(record?.[0] || {}), ...rightAnswer.data, solveTime },
      },
    };
  }

  // 修改记录信息
  async updateRecord(dto: RecordDTO) {
    // 存储错误记录
    await this.answersService.updateAnswer(dto);
    // 操作做题后的升降
    if (dto?.solveTime !== dto.submitTime) {
      await this.ltnService.updateBoxId({
        id: dto.topicId,
        type: dto?.isCorrect ? 'update' : 'degrade', // boxId 的升降
        time: dto.submitTime,
      });
    }
    // 存储做题记录
    return this.recordModel
      .findOneAndUpdate(
        { topicId: dto.topicId, submitTime: dto.submitTime },
        {
          $set: dto,
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
