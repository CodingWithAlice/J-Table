import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuestionAnswer extends Document {
  @Prop({ required: true })
  answer_text: string;

  @Prop({ type: [String] })
  wrong_notes: string[];

  @Prop({ required: true })
  question_id: number; // 关联 MySQL
}

export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswer);
