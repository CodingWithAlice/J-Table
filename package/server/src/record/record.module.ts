import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './record.service';
import { Record, RecordSchema } from './record.schema';
import { RecordController } from './record.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: RecordSchema, name: Record.name }]),
  ],
  providers: [RecordsService],
  exports: [RecordsService],
  controllers: [RecordController],
})
export class RecordsModule {}
