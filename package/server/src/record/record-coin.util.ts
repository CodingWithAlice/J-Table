type RecordCoinFields = {
  isCorrect?: boolean | null;
  durationSec?: number | string | null;
  coinAwarded?: boolean | null;
  isCheck?: boolean | null;
};

/** 是否已填写对错和时长，视为一次真实提交。 */
export function isRealSubmitRecord(
  record?: Pick<RecordCoinFields, 'isCorrect' | 'durationSec'> | null,
): boolean {
  return (
    record != null &&
    record.isCorrect !== undefined &&
    record.isCorrect !== null &&
    record.durationSec !== undefined &&
    record.durationSec !== null &&
    record.durationSec !== ''
  );
}

/** 当天这题是否已经为真实提交入过账。旧数据没有 coinAwarded 时，完整记录视为已入账。 */
export function wasAlreadyAwarded(record?: RecordCoinFields | null): boolean {
  if (!record) {
    return false;
  }
  if (record.coinAwarded === true) {
    return true;
  }
  if (record.coinAwarded === false) {
    return false;
  }
  return isRealSubmitRecord(record);
}

/** 仅「提交」且尚未入账时加做题金币；校验只存草稿。 */
export function shouldAwardRecordCoins(
  dto?: RecordCoinFields | null,
  existing?: RecordCoinFields | null,
): boolean {
  if (!dto || dto.isCheck) {
    return false;
  }
  return isRealSubmitRecord(dto) && !wasAlreadyAwarded(existing);
}
