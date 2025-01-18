import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';
import { LtnController } from './ltns.controller';
import { LtnService } from './ltns.service';

@Module({
  imports: [SequelizeModule.forFeature([Ltn])],
  providers: [LtnService],
  controllers: [LtnController],
})
export class LtnsModule {}
