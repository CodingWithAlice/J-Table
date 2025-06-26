import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeepSeekService } from './deepseek.service';
import { DeepSeekController } from './deepseek.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [DeepSeekService],
  exports: [DeepSeekService],
  controllers: [DeepSeekController],
})
export class DeepSeekModule {}
