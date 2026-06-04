import { Answer, AnswerSchema } from './answer.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersService } from './answer.service';
import { AnswerController } from './answer.controller';
import { CoinModule } from 'src/coin/coin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: AnswerSchema, name: Answer.name }]),
    CoinModule,
  ],
  providers: [AnswersService],
  exports: [AnswersService],
  controllers: [AnswerController],
})
export class AnswersModule {}
