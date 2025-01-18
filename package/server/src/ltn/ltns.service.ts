import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';

@Injectable()
export class LtnService {
    constructor(
        @InjectModel(Ltn)
        private ltnModel: typeof Ltn
      ) {}
    
      async findAll(): Promise<Ltn[]> {
        return this.ltnModel.findAll();
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
