import dayjs, { type Dayjs } from 'dayjs';

export const WEEKLY_COIN_GOAL = 100;
/** 缺口达到该值时用更狠的催促文案 */
export const WEEKLY_COIN_LARGE_GAP = 40;

export type WeeklyCoinGoal = {
  /** 昨天往前共 6 天的金币合计（不含今天） */
  pastSixSum: number;
  todayCoins: number;
  /** 计入今天后的周进度 */
  progress: number;
  /** 今天还需要拿多少才能凑满目标 */
  stillNeed: number;
  met: boolean;
  tip: string;
};

function coinsOnDate(
  daily: Array<{ date: string; coins: number }>,
  date: string,
): number {
  return daily
    .filter((item) => dayjs(item.date).format('YYYY-MM-DD') === date)
    .reduce((sum, item) => sum + (item.coins || 0), 0);
}

export function getWeeklyCoinGoalTip(
  stillNeed: number,
  met: boolean,
  fires: number,
): string {
  if (met) {
    return fires > 0
      ? '本周 100 已到手，顺手一题把火苗续上'
      : '本周 100 已到手，今天可以躺平';
  }
  if (stillNeed >= WEEKLY_COIN_LARGE_GAP) {
    return `缺口有点大，今天至少啃掉 ${stillNeed}`;
  }
  return `还差 ${stillNeed} 枚，今天拿下就稳了`;
}

/** 以「过去 6 天攒够 100，今天可歇」为节奏，给出进度与一句提示。 */
export function getWeeklyCoinGoal(
  daily: Array<{ date: string; coins: number }>,
  fires: number = 0,
  today: string | Dayjs = dayjs(),
): WeeklyCoinGoal {
  const d = dayjs(today);
  const todayKey = d.format('YYYY-MM-DD');
  let pastSixSum = 0;
  for (let i = 1; i <= 6; i += 1) {
    pastSixSum += coinsOnDate(daily, d.subtract(i, 'day').format('YYYY-MM-DD'));
  }
  const todayCoins = coinsOnDate(daily, todayKey);
  const progress = pastSixSum + todayCoins;
  const stillNeed = Math.max(0, WEEKLY_COIN_GOAL - progress);
  const met = stillNeed === 0;

  return {
    pastSixSum,
    todayCoins,
    progress,
    stillNeed,
    met,
    tip: getWeeklyCoinGoalTip(stillNeed, met, fires),
  };
}
