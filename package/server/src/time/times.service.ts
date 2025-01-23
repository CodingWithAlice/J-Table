import { Time } from './../models/time.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Routine } from 'src/models/routine.model';

@Injectable()
export class TimeService {
  constructor(
    @InjectModel(Time)
    private timeModel: typeof Time,

    @InjectModel(Routine)
    private readonly routineModel: typeof Routine,
  ) {}

  async findAll(): Promise<any> {
    const times = await this.timeModel.findAll({
      order: [['date', 'DESC']],
    });

    // 获取所有的 routineType
    const routineTypes = await this.routineModel.findAll();
    const routineTypeById = routineTypes.reduce((pre, cur) => {
      pre[cur.id] = cur.type;
      return pre;
    }, {});

    const data = times.map((it) => {
      const plain = it.toJSON();
      return {
        ...plain,
        routineType: routineTypeById[it.routineTypeId],
      };
    });

    return { data: data };
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
