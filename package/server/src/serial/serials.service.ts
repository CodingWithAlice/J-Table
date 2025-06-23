import { Serial } from '../models/serial.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SerialService {
  constructor(
    @InjectModel(Serial)
    private serialModel: typeof Serial,
  ) {}

  async findAll(): Promise<any> {
    const serials = await this.serialModel.findAll();
    return { data: serials };
  }

  findOne(id: string): Promise<Serial> {
    return this.serialModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const serial = await this.findOne(id);
    await serial.destroy();
  }
}
