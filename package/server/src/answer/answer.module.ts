import { Answer, AnswerSchema } from './answer.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersService } from './answer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: AnswerSchema, name: Answer.name }]),
  ],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
