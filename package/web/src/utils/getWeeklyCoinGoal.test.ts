import {
  getWeeklyCoinGoal,
  getWeeklyCoinGoalTip,
  WEEKLY_COIN_GOAL,
} from './getWeeklyCoinGoal';

const TODAY = '2026-09-29';

describe('getWeeklyCoinGoalTip', () => {
  it('cheers rest when met without fires', () => {
    expect(getWeeklyCoinGoalTip(0, true, 0)).toBe(
      '本周 100 已到手，今天可以躺平',
    );
  });

  it('nudges streak when met with fires', () => {
    expect(getWeeklyCoinGoalTip(0, true, 2)).toBe(
      '本周 100 已到手，顺手一题把火苗续上',
    );
  });

  it('uses soft push when gap is small', () => {
    expect(getWeeklyCoinGoalTip(28, false, 0)).toBe(
      '还差 28 枚，今天拿下就稳了',
    );
  });

  it('uses hard push when gap is large', () => {
    expect(getWeeklyCoinGoalTip(40, false, 0)).toBe(
      '缺口有点大，今天至少啃掉 40',
    );
  });
});

describe('getWeeklyCoinGoal', () => {
  it('sums the past 6 days and excludes today from that bank', () => {
    const goal = getWeeklyCoinGoal(
      [
        { date: '2026-09-29', coins: 5 },
        { date: '2026-09-28', coins: 10 },
        { date: '2026-09-27', coins: 10 },
        { date: '2026-09-26', coins: 10 },
        { date: '2026-09-25', coins: 10 },
        { date: '2026-09-24', coins: 10 },
        { date: '2026-09-23', coins: 10 },
        { date: '2026-09-22', coins: 99 },
      ],
      0,
      TODAY,
    );

    expect(goal.pastSixSum).toBe(60);
    expect(goal.todayCoins).toBe(5);
    expect(goal.progress).toBe(65);
    expect(goal.stillNeed).toBe(WEEKLY_COIN_GOAL - 65);
    expect(goal.met).toBe(false);
    expect(goal.tip).toBe('还差 35 枚，今天拿下就稳了');
  });

  it('marks met when past six already reach the goal', () => {
    const goal = getWeeklyCoinGoal(
      [
        { date: '2026-09-28', coins: 20 },
        { date: '2026-09-27', coins: 20 },
        { date: '2026-09-26', coins: 20 },
        { date: '2026-09-25', coins: 20 },
        { date: '2026-09-24', coins: 20 },
        { date: '2026-09-23', coins: 10 },
      ],
      2,
      TODAY,
    );

    expect(goal.pastSixSum).toBe(110);
    expect(goal.progress).toBe(110);
    expect(goal.stillNeed).toBe(0);
    expect(goal.met).toBe(true);
    expect(goal.tip).toBe('本周 100 已到手，顺手一题把火苗续上');
  });

  it('marks met after today fills the gap', () => {
    const goal = getWeeklyCoinGoal(
      [
        { date: '2026-09-29', coins: 30 },
        { date: '2026-09-28', coins: 70 },
      ],
      0,
      TODAY,
    );

    expect(goal.pastSixSum).toBe(70);
    expect(goal.progress).toBe(100);
    expect(goal.met).toBe(true);
    expect(goal.tip).toBe('本周 100 已到手，今天可以躺平');
  });
});
