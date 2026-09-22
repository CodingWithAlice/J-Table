import {
  isRealSubmitRecord,
  shouldAwardRecordCoins,
  wasAlreadyAwarded,
} from './record-coin.util';

describe('isRealSubmitRecord', () => {
  it('is false when there is no record yet', () => {
    expect(isRealSubmitRecord(null)).toBe(false);
    expect(isRealSubmitRecord(undefined)).toBe(false);
    expect(isRealSubmitRecord({})).toBe(false);
  });

  it('is false when duration or correctness is still missing', () => {
    expect(isRealSubmitRecord({ isCorrect: true })).toBe(false);
    expect(isRealSubmitRecord({ durationSec: 20 })).toBe(false);
    expect(isRealSubmitRecord({ isCorrect: true, durationSec: '' })).toBe(
      false,
    );
  });

  it('is true for a completed submit, including wrong or 0-minute', () => {
    expect(isRealSubmitRecord({ isCorrect: true, durationSec: 20 })).toBe(
      true,
    );
    expect(isRealSubmitRecord({ isCorrect: false, durationSec: 5 })).toBe(
      true,
    );
    expect(isRealSubmitRecord({ isCorrect: false, durationSec: 0 })).toBe(
      true,
    );
  });
});

describe('wasAlreadyAwarded', () => {
  it('is false for a check draft marked not awarded', () => {
    expect(
      wasAlreadyAwarded({
        isCorrect: true,
        durationSec: 8,
        coinAwarded: false,
      }),
    ).toBe(false);
  });

  it('is true once a real submit has been awarded', () => {
    expect(
      wasAlreadyAwarded({
        isCorrect: true,
        durationSec: 8,
        coinAwarded: true,
      }),
    ).toBe(true);
  });

  it('treats a legacy complete record without the flag as already awarded', () => {
    expect(
      wasAlreadyAwarded({ isCorrect: true, durationSec: 8 }),
    ).toBe(true);
  });
});

describe('shouldAwardRecordCoins', () => {
  const filled = { isCorrect: true, durationSec: 8 };

  it('does not award on 校验 even if duration and correctness are filled', () => {
    expect(shouldAwardRecordCoins({ ...filled, isCheck: true })).toBe(false);
  });

  it('awards on 提交 after a 校验 draft', () => {
    expect(
      shouldAwardRecordCoins(filled, { ...filled, coinAwarded: false }),
    ).toBe(true);
  });

  it('awards a first-time 提交 with no existing record', () => {
    expect(shouldAwardRecordCoins(filled)).toBe(true);
    expect(shouldAwardRecordCoins(filled, null)).toBe(true);
  });

  it('does not award twice for the same topic on the same day', () => {
    expect(
      shouldAwardRecordCoins(filled, { ...filled, coinAwarded: true }),
    ).toBe(false);
  });
});
