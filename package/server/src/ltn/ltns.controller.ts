import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LtnService } from './ltns.service';
import { CreateLtnDTO, ListAllEntities } from './create-ltn.dto';
import { AuthGuard } from 'src/auth.guard';

@Controller('api/ltn')
export class LtnController {
  constructor(private readonly ltnService: LtnService) {}

  @Get()
  findAll(@Query() query: ListAllEntities): Promise<any[]> {
    return this.ltnService.findAll(query);
  }

  @Get('copy')
  findAllCopy(@Query() query: ListAllEntities): Promise<any[]> {
    return this.ltnService.findAllCopy(query);
  }

  @Patch('operate')
  @UseGuards(AuthGuard)
  update(@Body() { id, type, time }: CreateLtnDTO) {
    if (!id || !type || !time) {
      throw new Error('参数错误');
    }
    return this.ltnService.updateBoxId({ id, type, time });
  }

  @Post('add')
  @UseGuards(AuthGuard)
  add(@Body() data) {
    if (!data) {
      throw new Error('参数错误');
    }
    return this.ltnService.addLtn(data);
  }
}
