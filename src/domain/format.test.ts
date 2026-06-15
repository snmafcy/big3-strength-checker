import { describe, it, expect } from 'vitest';
import { formatKg, roundToHalf, formatStandard } from './format';

describe('formatKg', () => {
  it('常に小数第1位まで表示（整数も .0）', () => {
    expect(formatKg(52)).toBe('52.0');
    expect(formatKg(110)).toBe('110.0');
    expect(formatKg(78.5)).toBe('78.5');
  });
  it('小数第1位に丸める', () => {
    expect(formatKg(80.3125)).toBe('80.3');
    expect(formatKg(51.875)).toBe('51.9');
  });
  it('丸めて整数になる場合も .0 を表示', () => {
    expect(formatKg(79.98)).toBe('80.0');
  });
});

describe('roundToHalf', () => {
  it('最近接の0.5刻みに丸める', () => {
    expect(roundToHalf(80.3125)).toBe(80.5);
    expect(roundToHalf(81.25)).toBe(81.5);
    expect(roundToHalf(80.2)).toBe(80);
    expect(roundToHalf(37.5)).toBe(37.5);
  });
});

describe('formatStandard', () => {
  it('0.5刻みに丸めて常に小数第1位まで表示', () => {
    expect(formatStandard(80)).toBe('80.0');
    expect(formatStandard(37.5)).toBe('37.5');
    expect(formatStandard(80.3125)).toBe('80.5');
    expect(formatStandard(81.25)).toBe('81.5');
    expect(formatStandard(199)).toBe('199.0');
  });
});
