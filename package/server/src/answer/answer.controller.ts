import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { AnswersService } from './answer.service';
import { AuthGuard } from 'src/auth.guard';

@Controller('api/answer')
export class AnswerController {
  constructor(private readonly answerService: AnswersService) {}

  @Get()
  findAll(@Query() params) {
    return this.answerService.findOne(params);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  updateAnswer(@Body() data) {
    return this.answerService.updateAnswer(data);
  }
}
