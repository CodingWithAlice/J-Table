import dayjs, { type Dayjs } from 'dayjs';

/** 隔天重做只展示最近 N 天内仍是错题的最新记录 */
export const REDO_WINDOW_DAYS = 7;

export function getRedoWindowStart(
  today: string | Dayjs = dayjs(),
): string {
  return dayjs(today).subtract(REDO_WINDOW_DAYS, 'day').format('YYYY-MM-DD');
}

export function isWithinRedoWindow(
  submitTime: string | undefined,
  today: string | Dayjs = dayjs(),
): boolean {
  if (!submitTime) {
    return false;
  }
  return dayjs(submitTime).format('YYYY-MM-DD') >= getRedoWindowStart(today);
}
