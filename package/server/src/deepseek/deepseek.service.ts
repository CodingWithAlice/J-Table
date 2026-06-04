import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

export interface MessageProp {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** 校验时的 AI 角色：启发式教练，而非严厉判题 */
const COMPARE_SYSTEM_PROMPT = `你是一位耐心、善于启发的前端学习教练，正在帮助用户复习面试/知识点题目。

## 你的目标
帮助用户从「当前这道题的思路」逐渐向「更完整、更标准的理解」靠近，而不是单方面评判对错或打击信心。

## 语气与态度（必须遵守）
- 温和、尊重、鼓励为主；先肯定用户答案里任何合理、部分正确或值得保留的思路
- 禁止使用或近似表达：完全错了、不行、太差、你没学会、这都不知道、基础太差 等打击性、羞辱性表述
- 不要居高临下、嘲讽或居高临下地「纠错清单」
- 即使用户答案与参考差距很大，也要用「我们还可以从另一个角度看…」「还差一小步」的方式引导

## 引导方式（必须遵守）
- 采用脚手架（Scaffolding）：承接用户已有思路 → 点出 1～2 个可思考的方向或理解缺口 → 用引导性问题推动用户自己补全
- 学习笔记中的参考要点仅供你内部分析；回复中不要原文照搬参考答案，最多用抽象概括（如「完整版通常还会强调 X 与 Y 的关系」）
- 避免「你的 A 错、B 错、C 错」式罗列；改为「你提到了…，如果再想想…可能会更接近完整答案」
- 每条建议要具体、可行动，但保留让用户自己思考、自己写完整答案的空间

## 输出格式
仅输出一个 JSON 对象：{"suggestion": ["第一条", "第二条", ...]}
- suggestion 为 3～5 条字符串，每条 1～3 句话，口语化、像学长带学弟
- 不要 markdown，不要用代码块包裹 JSON`;

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

  async chatCompletion(messages: MessageProp[], model = 'deepseek-v4-flash') {
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

  private normalizeSuggestion(data: unknown): string[] {
    const raw = (data as { suggestion?: unknown })?.suggestion;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => String(item).trim()).filter(Boolean);
    }
    return ['暂时无法生成学习引导，请稍后再试一次。'];
  }

  async compare({
    recent,
    right,
    title,
    usePro = false,
  }: {
    recent: string;
    right: string;
    title: string;
    usePro?: boolean;
  }) {
    const userPrompt = `题目：${title}（前端相关复习）

【用户本次作答】
${recent || '（未填写）'}

【学习笔记中的参考要点】（仅供你内部分析，勿在回复中原文照搬）
${right || '（暂无参考笔记）'}

请基于用户本次作答，用脚手架方式给出学习引导，帮助用户从现有思路慢慢靠近更完整的理解。`;

    const messages: MessageProp[] = [
      { role: 'system', content: COMPARE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const model = usePro ? 'deepseek-v4-pro' : 'deepseek-v4-flash';
    const { data } = await this.chatCompletion(messages, model);
    return { data: { suggestion: this.normalizeSuggestion(data) } };
  }
}
