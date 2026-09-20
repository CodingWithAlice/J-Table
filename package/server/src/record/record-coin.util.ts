/** 是否已填写对错和时长，视为一次真实提交。 */
export function isRealSubmitRecord(record?: {
  isCorrect?: boolean | null;
  durationSec?: number | string | null;
} | null): boolean {
  return (
    record != null &&
    record.isCorrect !== undefined &&
    record.isCorrect !== null &&
    record.durationSec !== undefined &&
    record.durationSec !== null &&
    record.durationSec !== ''
  );
}
