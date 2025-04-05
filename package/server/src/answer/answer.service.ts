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

  async findAll() {
    return this.answerModel.find().exec();
  }
  // 添加答案
  async addAnswer(dto: {
    answerText: string;
    wrongNotes?: string[];
    questionId: number;
  }) {
    const answer = new this.answerModel({
      answer_text: dto.answerText,
      wrong_notes: dto.wrongNotes || [],
      question_id: dto.questionId,
    });
    return answer.save();
  }
}
