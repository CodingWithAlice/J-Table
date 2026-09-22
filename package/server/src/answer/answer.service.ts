import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './answer.schema';
import { CoinService } from 'src/coin/coin.service';
import dayjs from 'dayjs';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name)
    private answerModel: Model<Answer>,
    private readonly coinService: CoinService,
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
  async updateAnswer(
    dto: {
      rightAnswer?: string;
      wrongNotes?: string;
      topicId: number;
      topicTitle?: string;
    },
    options?: { awardCoins?: boolean },
  ) {
    let coinAdded = false;
    let coinsAdded = 0;
    const today = dayjs().format('YYYY-MM-DD');

    // 做题保存会顺带更新 wrongNotes，只有显式「修改题目答案」才入账
    if (options?.awardCoins !== false) {
      const existingAnswer = (await this.answerModel
        .findOne({ topicId: dto.topicId })
        .select('updatedAt')
        .lean()) as any; // timestamps 由 mongoose 自动添加

      if (existingAnswer && existingAnswer.updatedAt) {
        const lastUpdatedDate = dayjs(existingAnswer.updatedAt).format(
          'YYYY-MM-DD',
        );

        if (lastUpdatedDate !== today) {
          coinsAdded = await this.coinService.addCoins(today, 1);
          coinAdded = coinsAdded > 0;
        }
      } else {
        coinsAdded = await this.coinService.addCoins(today, 1);
        coinAdded = coinsAdded > 0;
      }
    }

    const result = await this.answerModel
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
          lean: true, // 使用 lean() 转换为普通对象
        },
      )
      .exec();

    // 将 coinAdded 放在 data 内部，确保前端能正确获取
    // 确保 result 是普通对象，然后添加 coinAdded 字段
    const resultObj = result ? (result.toObject ? result.toObject() : result) : {};
    // 创建一个新对象，确保 coinAdded 字段被正确添加
    const responseData = {
      ...resultObj,
      coinAdded,
      coinsAdded,
    };
    return { data: responseData };
  }
}
