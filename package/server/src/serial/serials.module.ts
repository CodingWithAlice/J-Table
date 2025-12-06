import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Serial } from 'src/models/serial.model';
import { SerialService } from './serials.service';
import { SerialController } from './serials.controller';

@Module({
  controllers: [SerialController],
  providers: [SerialService],
  imports: [SequelizeModule.forFeature([Serial])],
})
export class SerialModule {}
