import { Routine } from './../models/routine.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine,
  ) {}

  // 按照 boxId 分组
  async findAll(): Promise<any> {
    const routines = await this.routineModel.findAll();
    return { data: routines };
  }

  findOne(id: string): Promise<Routine> {
    return this.routineModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await routine.destroy();
  }
}
