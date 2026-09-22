import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'answer_records' })
export class Record extends Document {
  @Prop({ required: true })
  topicTitle: string;

  @Prop()
  durationSec: number;

  @Prop({ required: true })
  submitTime: string;

  @Prop({ required: true })
  topicId: number;

  @Prop()
  isCorrect: boolean;

  @Prop({ required: true })
  recentAnswer: string; // 最近一次的答案

  @Prop()
  coinAwarded: boolean; // 当天该题是否已为真实提交入过账
}

export const RecordSchema = SchemaFactory.createForClass(Record);
