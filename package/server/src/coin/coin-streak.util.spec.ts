import { getStreakStatus, getStreakStatusForDate } from './coin-streak.util';

describe('getStreakStatus', () => {
  it('resets when yesterday has no coins', () => {
    expect(getStreakStatus(false, false)).toEqual({ fires: 0, multiplier: 1 });
    expect(getStreakStatus(false, true)).toEqual({ fires: 0, multiplier: 1 });
  });

  it('is 2x after a single consecutive day', () => {
    expect(getStreakStatus(true, false)).toEqual({ fires: 1, multiplier: 2 });
  });

  it('caps at 3x once two previous days have coins', () => {
    expect(getStreakStatus(true, true)).toEqual({ fires: 2, multiplier: 3 });
  });
});

describe('getStreakStatusForDate', () => {
  const today = '2026-09-15';

  it('treats missing dates as no activity', () => {
    expect(getStreakStatusForDate([], today)).toEqual({
      fires: 0,
      multiplier: 1,
    });
  });

  it('ignores today and older days beyond the previous two', () => {
    expect(
      getStreakStatusForDate(
        [
          { date: '2026-09-15', coins: 9 },
          { date: '2026-09-12', coins: 4 },
          { date: '2026-09-11', coins: 4 },
        ],
        today,
      ),
    ).toEqual({ fires: 0, multiplier: 1 });
  });

  it('is 2x when only yesterday has coins', () => {
    expect(
      getStreakStatusForDate(
        [
          { date: '2026-09-14', coins: 3 },
          { date: '2026-09-12', coins: 5 },
        ],
        today,
      ),
    ).toEqual({ fires: 1, multiplier: 2 });
  });

  it('is 3x when yesterday and the day before both have coins', () => {
    expect(
      getStreakStatusForDate(
        [
          { date: '2026-09-14', coins: 2 },
          { date: '2026-09-13', coins: 1 },
          { date: '2026-09-12', coins: 8 },
        ],
        today,
      ),
    ).toEqual({ fires: 2, multiplier: 3 });
  });

  it('treats a zero-coin day as broken', () => {
    expect(
      getStreakStatusForDate(
        [
          { date: '2026-09-14', coins: 2 },
          { date: '2026-09-13', coins: 0 },
        ],
        today,
      ),
    ).toEqual({ fires: 1, multiplier: 2 });
  });
});
