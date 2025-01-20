import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';

@Injectable()
export class LtnService {
  constructor(
    @InjectModel(Ltn)
    private ltnModel: typeof Ltn,
  ) {}

  // 按照 boxId 分组
  async findAll(): Promise<any> {
    const ltns = await this.ltnModel.findAll();
    const data = ltns.reduce((pre, cur) => {
      const boxId = cur.boxId;
      if (!pre[boxId]) {
        pre[boxId] = [];
      }
      pre[boxId].push(cur);
      return pre;
    }, {});
    return { data };
  }

  async updateBoxId(
    id: string,
    type: 'update' | 'degrade',
    time: string,
  ): Promise<Ltn> {
    const ltn = await this.findOne(id);
    if (type === 'degrade') {
      ltn.boxId = 1; // 1 代表做错了
    } else {
      ltn.boxId++;
    }
    ltn.solveTime = new Date(time);
    return ltn.save();
  }

  findOne(id: string): Promise<Ltn> {
    return this.ltnModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const ltn = await this.findOne(id);
    await ltn.destroy();
  }
}
