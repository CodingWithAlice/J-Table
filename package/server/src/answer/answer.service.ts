import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './answer.schema';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name)
    private answerModel: Model<Answer>,
  ) {}

  async create(answer: Partial<Answer>) {
    return this.answerModel.create(answer);
  }

  async findOne({ topicId }: { topicId: number | string }) {
    const res = await this.answerModel
      .find({ topicId: +topicId })
      .select('-_id') // 排除 _id 字段
      .lean();
    return { data: res?.[0] || {} };
  }

  // 修改答案
  async updateAnswer(dto: {
    rightAnswer?: string;
    wrongNotes?: string;
    topicId: number;
    topicTitle?: string;
  }) {
    return this.answerModel
      .findOneAndUpdate(
        { topicId: dto.topicId },
        {
          $set: {
            rightAnswer: dto.rightAnswer,
            wrongNotes: dto.wrongNotes,
            topicTitle: dto.topicTitle, // 可选更新字段
            topicId: dto.topicId,
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
