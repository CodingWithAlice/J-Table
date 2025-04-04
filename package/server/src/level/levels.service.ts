import { Level } from './../models/level.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LevelService {
  constructor(
    @InjectModel(Level)
    private levelModel: typeof Level,
  ) {}

  async findAll(): Promise<any> {
    const routines = await this.levelModel.findAll({ raw: true });
    return { data: routines };
  }
}
