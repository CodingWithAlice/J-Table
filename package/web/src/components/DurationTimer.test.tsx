import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'antd';
import DurationTimer, {
  accumulateTimerMinutes,
  ceilMinutesFromMs,
  type DurationTimerHandle,
} from './DurationTimer';

describe('ceilMinutesFromMs', () => {
  it('keeps 0 as 0', () => {
    expect(ceilMinutesFromMs(0)).toBe(0);
    expect(ceilMinutesFromMs(-1)).toBe(0);
  });

  it('ceils any positive duration under 1 minute to 1', () => {
    expect(ceilMinutesFromMs(1)).toBe(1);
    expect(ceilMinutesFromMs(59999)).toBe(1);
    expect(ceilMinutesFromMs(60000)).toBe(1);
  });

  it('ceils leftover seconds into the next minute', () => {
    expect(ceilMinutesFromMs(60001)).toBe(2);
    expect(ceilMinutesFromMs(90 * 1000)).toBe(2);
  });
});

describe('accumulateTimerMinutes', () => {
  it('returns previously saved minutes when the timer is not running', () => {
    expect(accumulateTimerMinutes(5, null, Date.now())).toBe(5);
  });

  it('adds the current running session instead of keeping the last saved value', () => {
    expect(accumulateTimerMinutes(5, 0, 90 * 1000)).toBe(7);
  });

  it('counts a first session with no previous minutes', () => {
    expect(accumulateTimerMinutes(0, 0, 10 * 1000)).toBe(1);
  });
});

describe('DurationTimer.flush', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-20T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stops a running timer and includes the last session in the flushed minutes', () => {
    const onChange = jest.fn();
    const timerRef = createRef<DurationTimerHandle>();
    render(
      <DurationTimer
        timerRef={timerRef}
        value={5}
        onChange={onChange}
        forceShowInput
      />,
    );

    fireEvent.click(screen.getByText('开始计时'));
    jest.setSystemTime(new Date('2026-09-20T12:01:30Z'));

    let flushed: number | undefined;
    act(() => {
      flushed = timerRef.current?.flush();
    });
    expect(flushed).toBe(7);
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('still flushes the running session when wrapped in Form.Item', () => {
    const timerRef = createRef<DurationTimerHandle>();
    render(
      <Form initialValues={{ durationSec: 5 }}>
        <Form.Item name="durationSec" noStyle>
          <DurationTimer timerRef={timerRef} forceShowInput />
        </Form.Item>
      </Form>,
    );

    fireEvent.click(screen.getByText('开始计时'));
    jest.setSystemTime(new Date('2026-09-20T12:01:30Z'));

    let flushed: number | undefined;
    act(() => {
      flushed = timerRef.current?.flush();
    });
    expect(flushed).toBe(7);
  });
});
