import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

export interface MessageProp {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
@Injectable()
export class DeepSeekService {
  private openai: OpenAI;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.configService.get<string>('DEEPSEEK_API_KEY') || 'a',
      dangerouslyAllowBrowser: true, // 仅在浏览器环境需要
    });
  }

  async chatCompletion(prompt: string, model = 'deepseek-chat') {
    const messages: MessageProp[] = [
      { role: 'user', content: prompt || '' },
      {
        role: 'assistant',
        content: process.env?.ltn_EXAMPLE || '',
      },
    ];
    const response = await this.openai.chat.completions.create({
      model,
      messages,
      response_format: {
        type: 'json_object',
      },
    });
    const content = response.choices[0]?.message?.content;

    return { data: JSON.parse(content) };
  }

  async compare({
    recent,
    right,
    title,
  }: {
    recent: string;
    right: string;
    title: string;
  }) {
    const prompt = `我在复习题目为：${title} 的前端相关内容，我这次面对这个问题想到的答案是：${recent}，我看了下之前的学习笔记，当时记录的答案是${right}，可以帮我比较下两个答案，针对我现在的答案，给出一些意见吗`;

    return this.chatCompletion(prompt);
  }
}
