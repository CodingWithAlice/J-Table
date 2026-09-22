import dayjs, { type Dayjs } from 'dayjs';

export type StreakStatus = {
  fires: 0 | 1 | 2;
  multiplier: 1 | 2 | 3;
};

export function getStreakStatus(
  hasYesterday: boolean,
  hasDayBeforeYesterday: boolean,
): StreakStatus {
  if (!hasYesterday) {
    return { fires: 0, multiplier: 1 };
  }
  if (!hasDayBeforeYesterday) {
    return { fires: 1, multiplier: 2 };
  }
  return { fires: 2, multiplier: 3 };
}

function hasCoinsOnDate(
  daily: Array<{ date: string; coins: number }>,
  date: string,
): boolean {
  return daily.some(
    (item) => dayjs(item.date).format('YYYY-MM-DD') === date && item.coins > 0,
  );
}

/** 入账日的倍率只看前两天是否有金币，与今天无关。 */
export function getStreakStatusForDate(
  daily: Array<{ date: string; coins: number }>,
  date: string | Dayjs = dayjs(),
): StreakStatus {
  const d = dayjs(date);
  const yesterday = d.subtract(1, 'day').format('YYYY-MM-DD');
  const dayBefore = d.subtract(2, 'day').format('YYYY-MM-DD');
  return getStreakStatus(
    hasCoinsOnDate(daily, yesterday),
    hasCoinsOnDate(daily, dayBefore),
  );
}
