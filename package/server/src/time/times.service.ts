import { Time } from './../models/time.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TimeService {
  constructor(
    @InjectModel(Time)
    private timeModel: typeof Time,
  ) {}

  async findAll(): Promise<any> {
    const times = await this.timeModel.findAll({
      order: [['date', 'DESC']],
    });
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
