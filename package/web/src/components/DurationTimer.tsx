import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';

/** 未满 1 分钟按 1 分钟计；0 保持 0 */
export function ceilMinutesFromMs(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return Math.max(1, Math.ceil(elapsedMs / 60000));
}

/** 停表时把当前这一段累加到已确认分钟；未在计时则原样返回 */
export function accumulateTimerMinutes(
  savedMinutes: number,
  runningSince: number | null,
  now: number,
): number {
  if (runningSince == null) return savedMinutes;
  return savedMinutes + ceilMinutesFromMs(now - runningSince);
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function parseMinutes(value: unknown): number {
  if (value === undefined || value === null || value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export type DurationTimerHandle = {
  /** 若正在计时则结束并累加；回写 onChange，返回当前总分钟数（无则 undefined） */
  flush: () => number | undefined;
};

type DurationTimerProps = {
  value?: number | string;
  onChange?: (v: number | undefined) => void;
  /** 校验后强制展示输入框（便于提交时手填） */
  forceShowInput?: boolean;
  /**
   * 普通 prop 暴露 flush。Form.Item 的 cloneElement 可能拿不到 forwardRef，
   * 提交时就会跳过停表，把「当前这一段」丢掉。
   */
  timerRef?: Ref<DurationTimerHandle>;
};

const DurationTimer = forwardRef<DurationTimerHandle, DurationTimerProps>(
  function DurationTimer(
    { value, onChange, forceShowInput = false, timerRef },
    ref,
  ) {
    const [isRunning, setIsRunning] = useState(false);
    const [tick, setTick] = useState(0);
    const [hasAccumulated, setHasAccumulated] = useState(() => parseMinutes(value) > 0);
    const runningSinceRef = useRef<number | null>(null);
    const savedMinutesRef = useRef(parseMinutes(value));
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // 外部表单值变化（初始化 / 手改）时同步基准
    useEffect(() => {
      if (runningSinceRef.current != null) return;
      const mins = parseMinutes(value);
      savedMinutesRef.current = mins;
      if (mins > 0) setHasAccumulated(true);
    }, [value]);

    useEffect(() => {
      if (!isRunning) return undefined;
      const id = window.setInterval(() => setTick((t) => t + 1), 1000);
      return () => window.clearInterval(id);
    }, [isRunning]);

    const sessionMs =
      isRunning && runningSinceRef.current != null
        ? Date.now() - runningSinceRef.current
        : 0;
    // tick 仅用于触发重渲染
    void tick;

    const commitMinutes = (mins: number) => {
      savedMinutesRef.current = mins;
      if (mins > 0) setHasAccumulated(true);
      onChangeRef.current?.(mins > 0 ? mins : undefined);
    };

    const stopAndAccumulate = (): number | undefined => {
      // 只看 runningSinceRef：flush 可能拿着过期闭包里的 isRunning=false，
      // 那样会直接返回上一次已确认的分钟，漏掉当前这一段。
      const runningSince = runningSinceRef.current;
      if (runningSince == null) {
        const current = savedMinutesRef.current;
        return current > 0 ? current : undefined;
      }
      const total = accumulateTimerMinutes(
        savedMinutesRef.current,
        runningSince,
        Date.now(),
      );
      runningSinceRef.current = null;
      setIsRunning(false);
      commitMinutes(total);
      return total > 0 ? total : undefined;
    };

    const stopAndAccumulateRef = useRef(stopAndAccumulate);
    stopAndAccumulateRef.current = stopAndAccumulate;

    // 空依赖：handle 只绑一次，内部始终走 ref，避免每秒 tick 把 ref 清掉。
    // timerRef 是普通 prop，避免被 Form.Item cloneElement 吃掉 forwardRef。
    useImperativeHandle(
      ref,
      () => ({ flush: () => stopAndAccumulateRef.current() }),
      [],
    );
    useImperativeHandle(
      timerRef,
      () => ({ flush: () => stopAndAccumulateRef.current() }),
      [],
    );

    const handleStart = () => {
      // 手改后的值作为新基准
      savedMinutesRef.current = parseMinutes(value) || savedMinutesRef.current;
      runningSinceRef.current = Date.now();
      setIsRunning(true);
      setTick(0);
    };

    const handleStop = () => {
      stopAndAccumulate();
    };

    const showInput = forceShowInput || hasAccumulated || parseMinutes(value) > 0;
    const displayValue =
      value === undefined || value === null || value === ''
        ? ''
        : String(value);

    return (
      <Space wrap align="center">
        {showInput && (
          <Input
            style={{ width: 120 }}
            placeholder="单位：分钟"
            value={displayValue}
            disabled={isRunning}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === '') {
                savedMinutesRef.current = 0;
                onChange?.(undefined);
                return;
              }
              const n = Number(raw);
              if (!Number.isFinite(n) || n < 0) return;
              savedMinutesRef.current = n;
              if (n > 0) setHasAccumulated(true);
              onChange?.(n);
            }}
          />
        )}
        {isRunning ? (
          <>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: '#1677ff' }}>
              {formatElapsed(sessionMs)}
            </span>
            <Button
              icon={<PauseCircleOutlined />}
              onClick={handleStop}
            >
              结束计时
            </Button>
          </>
        ) : (
          <Button
            type={showInput ? 'default' : 'primary'}
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
          >
            开始计时
          </Button>
        )}
      </Space>
    );
  },
);

export default DurationTimer;
