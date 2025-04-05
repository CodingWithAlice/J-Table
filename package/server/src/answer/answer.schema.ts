import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'question_answers' })
export class Answer extends Document {
  @Prop({ required: true })
  answer_text: string;

  @Prop({ type: [String], default: [] })
  wrong_notes: string[];

  @Prop({ type: String })
  question_title: string;

  @Prop({ required: true })
  question_id: number; // 关联 MySQL
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
