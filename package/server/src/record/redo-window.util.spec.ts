import { getRedoWindowStart, isWithinRedoWindow } from './redo-window.util';

describe('getRedoWindowStart', () => {
  it('starts 7 days before today', () => {
    expect(getRedoWindowStart('2026-09-20')).toBe('2026-09-13');
  });
});

describe('isWithinRedoWindow', () => {
  const today = '2026-09-20';

  it('keeps a wrong record from today', () => {
    expect(isWithinRedoWindow('2026-09-20', today)).toBe(true);
  });

  it('keeps a wrong record from exactly 7 days ago', () => {
    expect(isWithinRedoWindow('2026-09-13', today)).toBe(true);
  });

  it('drops a wrong record older than 7 days', () => {
    expect(isWithinRedoWindow('2026-09-12', today)).toBe(false);
    expect(isWithinRedoWindow('2026-08-01', today)).toBe(false);
  });

  it('drops missing submitTime', () => {
    expect(isWithinRedoWindow(undefined, today)).toBe(false);
  });
});
