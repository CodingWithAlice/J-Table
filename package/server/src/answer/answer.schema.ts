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

  /** 最近一次因「修改题目答案」入账的日期 YYYY-MM-DD；与 updatedAt 分离，避免做题顺带更新吃掉改答案金币 */
  @Prop({ type: String })
  lastAnswerCoinDate?: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
