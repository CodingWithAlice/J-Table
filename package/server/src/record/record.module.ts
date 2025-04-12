import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordsService } from './record.service';
import { Record, RecordSchema } from './record.schema';
import { RecordController } from './record.controller';
import { LtnsModule } from 'src/ltn/ltns.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: RecordSchema, name: Record.name }]),
    LtnsModule,
  ],
  providers: [RecordsService],
  exports: [RecordsService],
  controllers: [RecordController],
})
export class RecordsModule {}
