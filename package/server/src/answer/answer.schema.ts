import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'question_answers' })
export class Answer extends Document {
  @Prop({ required: true })
  right_answer: string;

  @Prop({ type: [String], default: [] })
  wrong_notes: string[];

  @Prop({ type: String })
  topic_title: string;

  @Prop({ required: true })
  topic_id: number; // 关联 MySQL
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
