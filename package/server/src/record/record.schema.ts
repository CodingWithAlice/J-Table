import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Record extends Document {
  @Prop({ required: true })
  question_title: string;

  @Prop({ required: true })
  duration_sec: number;

  @Prop({ required: true, type: Date })
  submit_time: Date;

  @Prop({ required: true })
  question_id: number;

  @Prop({ required: true })
  is_correct: boolean;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
