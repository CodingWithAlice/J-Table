import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AnswersService } from './answer.service';

@Controller('api/answer')
export class AnswerController {
  constructor(private readonly answerService: AnswersService) {}

  @Get()
  findAll(@Query() params) {
    return this.answerService.findOne(params);
  }

  @Post('update')
  updateAnswer(@Body() data) {
    return this.answerService.updateAnswer(data);
  }
}
