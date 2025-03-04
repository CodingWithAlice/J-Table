import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';
import { LtnController } from './ltns.controller';
import { LtnService } from './ltns.service';

@Module({
  controllers: [LtnController],
  providers: [LtnService],
  imports: [SequelizeModule.forFeature([Ltn])],
})
export class LtnsModule {}
