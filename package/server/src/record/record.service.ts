import { LtnService } from 'src/ltn/ltns.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './record.schema';
import dayjs from 'dayjs';
import { AnswersService } from 'src/answer/answer.service';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface RecordDTO {
  topicId: number;
  topicTitle?: string;
  recentAnswer?: string;
  durationSec?: number;
  submitTime: string;
  solveTime?: string;
  isCorrect?: boolean;
  lastStatus?: boolean;
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

    // 查询该topicId的所有记录（仅获取submitTime）
    const historyRecords = await this.recordModel
      .find({ topicId: +topicId })
      .sort({ submitTime: -1 }) // 按时间倒排
      .select('submitTime durationSec -_id') // 只返回submitTime字段，排除_id
      .lean();

    // 查询最近一次完整记录
    const latestRecord = await this.recordModel
      .findOne({ topicId: +topicId })
      .sort({ submitTime: -1 }) // 按时间倒排
      .select('-_id') // 排除 _id 字段
      .lean();

    const rightAnswer = await this.answersService.findOne({ topicId });
    return {
      data: {
        showRightAnswer,
        record: {
          ...(latestRecord || {}),
          ...rightAnswer.data,
          solveTime,
        },
        historyRecords: historyRecords.map((item) => {
          const durationSec = item?.durationSec;
          const formattedDuration = durationSec ? '/' + durationSec + 'm' : ''; // 处理展示格式
          return `${item.submitTime}${formattedDuration}`;
        }), // 只返回时间数组
      },
    };
  }

  // 查询指定日期的记录
  // 调用方式 GET /records/by-date?date=2023-08-01
  async findByDate({ date }: { date: string }) {
    const normalizedDate = dayjs(date).format('YYYY-MM-DD');
    const data = await this.recordModel
      .find({
        submitTime: normalizedDate,
      })
      .select('-_id')
      .lean();
    return { data };
  }

  // 查询隔天重做的记录
  async findLastWrong() {
    // 1、聚合查询：按topicId分组，只保留每组最新的错误记录
    const incorrectRecords = await this.recordModel.aggregate([
      {
        $match: { isCorrect: false }, // 只筛选错误答案
      },
      {
        $sort: { submitTime: -1 }, // 按提交时间倒序
      },
      {
        $group: {
          _id: '$topicId', // 按topicId分组
          latestRecord: { $first: '$$ROOT' }, // 取每组第一条（即最新记录）
        },
      },
      {
        $replaceRoot: { newRoot: '$latestRecord' }, // 展开为完整文档
      },
      {
        $project: { _id: 0 }, // 排除MongoDB默认_id
      },
    ]);

    // 2. 关联题目详情
    const topics = await Promise.all(
      incorrectRecords.map((record) => this.ltnService.findOne(record.topicId)),
    );
    return {
      data: incorrectRecords.map((record, index) => ({
        ...record,
        ...topics[index]?.dataValues, // 附加题目详情
      })),
    };
  }

  // 修改记录信息
  async updateRecord(dto: RecordDTO) {
    // 1、更新/创建 做题记录
    const where = {
      topicId: dto.topicId,
      submitTime: dto.submitTime,
    };
    const existingRecord = await this.recordModel.findOne(where);
    const isCreated = !existingRecord;

    const result = await this.recordModel
      .findOneAndUpdate(
        where,
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
    // 2、存储错误记录 wrongNotes
    await this.answersService.updateAnswer(dto);
    // 3、操作做题后的升降(隔天重做时不操作、修改做题记录时不操作-避免重复操作)
    if (isCreated && dto?.solveTime !== dto.submitTime && !dto?.lastStatus) {
      await this.ltnService.updateBoxId({
        id: dto.topicId,
        type: dto?.isCorrect ? 'update' : 'degrade', // boxId 的升降
        time: dto.submitTime,
      });
    }
    // 返回更新后的文档（兼容原有逻辑）
    return result;
  }
}
