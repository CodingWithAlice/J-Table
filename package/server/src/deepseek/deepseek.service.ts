import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

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
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0]?.message?.content || 'No response';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to get response from DeepSeek');
    }
  }

  async compare({ recent, right }: { recent: string; right: string }) {
    const prompt = `${recent} ${right}`;
    await this.chatCompletion(prompt);
  }
}
