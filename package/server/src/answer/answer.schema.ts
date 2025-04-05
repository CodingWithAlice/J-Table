import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Answer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  price: number;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
