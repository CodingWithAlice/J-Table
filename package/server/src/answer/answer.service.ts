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

  async findOne({ topicId }: { topicId: number }) {
    const data = await this.answerModel.find({ topic_id: +topicId }).exec();
    return { data };
  }

  // 添加答案
  async addAnswer(dto: {
    rightAnswer: string;
    wrongNotes?: string[];
    topicId: number;
    topicTitle: string;
  }) {
    const answer = new this.answerModel({
      right_answer: dto.rightAnswer,
      wrong_notes: dto.wrongNotes || [],
      topic_id: dto.topicId,
      topic_title: dto.topicTitle,
    });
    return answer.save();
  }

  // 修改答案
  async updateAnswer(dto: {
    rightAnswer: string;
    wrongNotes?: string[];
    topicId: number;
    topicTitle: string;
  }) {
    return this.answerModel
      .findOneAndUpdate(
        { topic_id: dto.topicId },
        {
          $set: {
            right_answer: dto.rightAnswer,
            wrong_notes: dto.wrongNotes,
            topic_title: dto.topicTitle, // 可选更新字段
          },
        },
        { new: true }, // 返回更新后的文档
      )
      .exec();
  }
}
