import { isRealSubmitRecord } from './record-coin.util';

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
