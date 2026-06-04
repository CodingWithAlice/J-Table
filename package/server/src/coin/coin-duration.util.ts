/**
 * 根据做题时长（分钟）计算附加金币。
 * 每满 30 分钟 +1，无需题目分类。
 */
export function getDurationCoinBonus(durationMin: number): number {
  if (!durationMin || durationMin < 30) {
    return 0;
  }
  return Math.floor(durationMin / 30);
}

/**
 * 基础金币 + 时长附加金币。
 */
export function applyDurationBonus(
  baseCoins: number,
  durationMin?: number,
): number {
  if (baseCoins <= 0) {
    return 0;
  }
  return baseCoins + getDurationCoinBonus(durationMin ?? 0);
}
