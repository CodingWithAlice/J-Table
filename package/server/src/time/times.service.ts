import { Time } from './../models/time.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TimeService {
  constructor(
    @InjectModel(Time)
    private timeModel: typeof Time,
  ) {}

  // 按照 boxId 分组
  async findAll(): Promise<any> {
    const times = await this.timeModel.findAll();
    return { data: times };
  }

  findOne(id: string): Promise<Time> {
    return this.timeModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const time = await this.findOne(id);
    await time.destroy();
  }
}
