import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'question_answers' })
export class Answer extends Document {
  @Prop({ required: true })
  rightAnswer: string;

  @Prop()
  wrongNotes: string;

  @Prop({ type: String })
  topicTitle: string;

  @Prop({ required: true })
  topicId: number; // 关联 MySQL
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
