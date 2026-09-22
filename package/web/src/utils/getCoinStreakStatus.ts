import dayjs, { type Dayjs } from 'dayjs';

export type CoinStreakStatus = {
  fires: 0 | 1 | 2;
  multiplier: 1 | 2 | 3;
};

function hasCoinsOnDate(
  daily: Array<{ date: string; coins: number }>,
  date: string,
): boolean {
  return daily.some(
    (item) => dayjs(item.date).format('YYYY-MM-DD') === date && item.coins > 0,
  );
}

/** 今日倍率只看昨天、前天是否有金币；断一天即回到 1 倍、无火苗。 */
export function getCoinStreakStatus(
  daily: Array<{ date: string; coins: number }>,
  today: string | Dayjs = dayjs(),
): CoinStreakStatus {
  const d = dayjs(today);
  const yesterday = d.subtract(1, 'day').format('YYYY-MM-DD');
  const dayBefore = d.subtract(2, 'day').format('YYYY-MM-DD');
  const hasYesterday = hasCoinsOnDate(daily, yesterday);
  const hasDayBefore = hasCoinsOnDate(daily, dayBefore);

  if (!hasYesterday) {
    return { fires: 0, multiplier: 1 };
  }
  if (!hasDayBefore) {
    return { fires: 1, multiplier: 2 };
  }
  return { fires: 2, multiplier: 3 };
}
