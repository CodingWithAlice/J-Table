import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ltn } from '../models/ltn.model';
import dayjs from 'dayjs';
import { CreateLtnDTO, ListAllEntities } from './create-ltn.dto';
import { LevelService } from 'src/level/levels.service';

@Injectable()
export class LtnService {
  constructor(
    @InjectModel(Ltn)
    private ltnModel: typeof Ltn,
    private readonly levelService: LevelService,
  ) {}

  // 按照 boxId 分组
  async findAll({ start, end, useMinDate }: ListAllEntities): Promise<any> {
    const ltns = await this.ltnModel.findAll({ raw: true });
    
    let queryStart = start;
    let queryEnd = end;
    
    // 只有在 useMinDate 为 true 时，才计算最小日期并查询当天数据
    if (useMinDate && (!start || !end)) {
      // 计算最小日期（所有 LTN 的下次做题时间中的最小值）
      let minDate: Date | null = null;
      ltns.forEach((ltn) => {
        if (ltn.solveTime) {
          const nextTime = new Date(
            new Date(ltn.solveTime).getTime() +
              ltn.customDuration * 24 * 60 * 60 * 1000,
          );
          if (!minDate || nextTime < minDate) {
            minDate = nextTime;
          }
        }
      });

      // 如果没有找到最小日期，使用当前日期
      if (!minDate) {
        minDate = new Date();
      }

      const minDateStr = dayjs(minDate).format('YYYY-MM-DD');
      queryStart = minDateStr;
      queryEnd = minDateStr;
    }
    
    const data = ltns.reduce((pre, cur) => {
      const boxId = cur.boxId;
      if (!pre[boxId]) {
        pre[boxId] = [];
      }
      // 有时间筛选条件
      if (queryStart && queryEnd) {
        if (cur.solveTime) {
          const time =
            new Date(cur.solveTime).getTime() +
            cur.customDuration * 24 * 60 * 60 * 1000;
          if (
            time >= new Date(queryStart).getTime() &&
            time <= new Date(queryEnd).getTime()
          ) {
            pre[boxId].push(cur);
          }
        }
      } else {
        // 没有时间筛选条件，返回全量数据
        pre[boxId].push(cur);
      }

      return pre;
    }, {});
    return { data };
  }

  async findAllCopy({ start, end }: ListAllEntities): Promise<any> {
    const { data } = await this.findAll({ start, end });
    const totalArr = Object.keys(data).reduce((pre, cur) => {
      const count = data[cur].length;
      pre.push(count);
      return pre;
    }, []);

    const dataByDate = getDataByDate(data);

    console.log('过滤后的数据data 按时间和 LTN 分类', totalArr, dataByDate);
    return { totalArr, dataByDate };

    function getDataByLtns(data) {
      return Object.keys(data)
        .map((it) => {
          const ltns = data[it];
          const idDesc = ltns.length
            ? `
    LTN${it} 【推荐做题时间 ${ltns[0].suggestTime} - ${ltns.length}题 实际做题时间： ？】
    `
            : '';
          return (
            idDesc +
            ltns
              .map(
                (ltn) => `${ltn.title}
    `,
              )
              .join('')
          );
        })
        .join('');
    }
    function getDataByDate(data) {
      const classifyByDate = {};
      Object.keys(data).forEach((it) => {
        const ltnData = data[it];
        ltnData.forEach((ltn) => {
          // 添加推荐做题时间
          const suggestTime = dayjs(ltn.solveTime)
            .add(ltn.customDuration, 'day')
            .format('MM-DD');
          const newOne = {
            ...ltn,
            suggestTime,
          };
          if (!classifyByDate[newOne.suggestTime]) {
            classifyByDate[newOne.suggestTime] = [];
          }
          // 按照推荐做题时间分类
          classifyByDate[newOne.suggestTime].push(newOne);
        });
      });
      let res = '';
      // 按照推荐做题时间排序
      const sortDate = Object.keys(classifyByDate).sort((a, b) => {
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1;
      });

      // 按照推荐做题时间分类
      sortDate.forEach((it) => {
        const ltns = classifyByDate[it];
        const ltnsByBox = {};
        ltns.forEach((ltn) => {
          const boxId = ltn.boxId;
          if (!ltnsByBox[boxId]) {
            ltnsByBox[boxId] = [];
          }
          // 按照BOX分类
          ltnsByBox[boxId].push(ltn);
        });
        res += getDataByLtns(ltnsByBox);
      });
      return res;
    }
  }

  async updateBoxId({ id, type, time }: CreateLtnDTO) {
    // 兼容 NaN 和无效的 id 值，不抛出错误，只不执行后续操作
    const numericId = +id;
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      return { data: null };
    }
    
    const ltn = await this.findOne(numericId);
    // 没有找到记录，则不处理，直接返回
    if (!ltn) {
      return { data: null };
    }
    
    if (type === 'degrade' || type === 'fresh') {
      ltn.boxId = 1; // 1 代表做错了
    } else {
      ltn.boxId++;
    }
    ltn.solveTime = new Date(time);
    const data = await ltn.save();
    return { data };
  }

  async addLtn(data) {
    // 取默认间隔时间
    const levels = await this.levelService.findAll();
    const levelId = data.levelId;
    const level = levels.data.find((it) => it.id === levelId);

    const newLtn = await this.ltnModel.create({
      ...data,
      customDuration: level.basicDuration,
    });
    return { data: newLtn, levels, levelId };
  }

  findOne(id: number): Promise<Ltn> {
    return this.ltnModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const ltn = await this.findOne(id);
    await ltn.destroy();
  }
}
