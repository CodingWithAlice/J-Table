import { Controller, Get, Post, Patch, Query, Body } from '@nestjs/common';
import { AnswersService } from './answer.service';

@Controller('api/answer')
export class AnswerController {
  constructor(private readonly answerService: AnswersService) {}

  @Get()
  findAll(@Query() params): Promise<any[]> {
    return this.answerService.findAll(params);
  }

  @Post('add')
  addAnswer(@Body() data) {
    return this.answerService.addAnswer(data);
  }

  @Patch('update')
  updateAnswer(@Body() data) {
    return this.answerService.updateAnswer(data);
  }
}
