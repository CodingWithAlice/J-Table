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

  async findOne(params: { questionId: number }) {
    const data = await this.answerModel
      .find({ question_id: +params.questionId })
      .exec();
    return { data };
  }

  // 添加答案
  async addAnswer(dto: {
    answerText: string;
    wrongNotes?: string[];
    questionId: number;
    questionTitle: string;
  }) {
    const answer = new this.answerModel({
      answer_text: dto.answerText,
      wrong_notes: dto.wrongNotes || [],
      question_id: dto.questionId,
      question_title: dto.questionTitle,
    });
    return answer.save();
  }

  // 修改答案
  async updateAnswer(dto: {
    answerText: string;
    wrongNotes?: string[];
    questionId: number;
    questionTitle: string;
  }) {
    return this.answerModel
      .findOneAndUpdate(
        { question_id: dto.questionId },
        {
          $set: {
            answer_text: dto.answerText,
            wrong_notes: dto.wrongNotes,
            question_title: dto.questionTitle, // 可选更新字段
          },
        },
        { new: true }, // 返回更新后的文档
      )
      .exec();
  }
}
