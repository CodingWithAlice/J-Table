import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'answer_records' })
export class Record extends Document {
  @Prop({ required: true })
  topic_title: string;

  @Prop()
  duration_sec: number;

  @Prop({ required: true })
  topic_id: number;

  @Prop()
  is_correct: boolean;

  @Prop({ required: true })
  recent_answer: string; // 最近一次的答案
}

export const RecordSchema = SchemaFactory.createForClass(Record);
