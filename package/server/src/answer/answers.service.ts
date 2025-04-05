import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './answer.schema';
import { QuestionAnswer } from './question-answer.schema';
import { AnswerRecord } from './answer-record.schema';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(QuestionAnswer.name)
    private answerModel: Model<QuestionAnswer>,
    @InjectModel(AnswerRecord.name) private recordModel: Model<AnswerRecord>,
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
