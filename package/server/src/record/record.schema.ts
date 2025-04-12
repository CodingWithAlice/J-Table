import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop({ required: true })
  topic_title: string;

  @Prop({ required: true })
  duration_sec: number;

  @Prop({ required: true, type: Date })
  submit_time: Date;

  @Prop({ required: true })
  topic_id: number;

  @Prop({ required: true })
  is_correct: boolean;

  @Prop({ required: true })
  recent_answer: boolean; // 最近一次的答案
}

export const RecordSchema = SchemaFactory.createForClass(Record);
