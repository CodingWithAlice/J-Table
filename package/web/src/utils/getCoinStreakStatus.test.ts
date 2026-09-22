import { getCoinStreakStatus } from './getCoinStreakStatus';

const TODAY = '2026-09-15';

describe('getCoinStreakStatus', () => {
  it('keeps the original 1x state when yesterday has no coins', () => {
    expect(getCoinStreakStatus([], TODAY)).toEqual({ fires: 0, multiplier: 1 });
    expect(
      getCoinStreakStatus([{ date: '2026-09-13', coins: 4 }], TODAY),
    ).toEqual({ fires: 0, multiplier: 1 });
  });

  it('shows one fire and 2x when only yesterday has coins', () => {
    expect(
      getCoinStreakStatus([{ date: '2026-09-14', coins: 3 }], TODAY),
    ).toEqual({ fires: 1, multiplier: 2 });
  });

  it('shows two fires and 3x when the previous two days both have coins', () => {
    expect(
      getCoinStreakStatus(
        [
          { date: '2026-09-14', coins: 2 },
          { date: '2026-09-13', coins: 1 },
        ],
        TODAY,
      ),
    ).toEqual({ fires: 2, multiplier: 3 });
  });

  it('does not count today toward the multiplier', () => {
    expect(
      getCoinStreakStatus([{ date: '2026-09-15', coins: 10 }], TODAY),
    ).toEqual({ fires: 0, multiplier: 1 });
  });
});
