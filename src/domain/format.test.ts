import { describe, it, expect } from 'vitest';
import { formatKg, roundToHalf, formatStandard } from './format';

describe('formatKg', () => {
  it('整数は小数点なし', () => {
    expect(formatKg(52)).toBe('52');
    expect(formatKg(110)).toBe('110');
  });
  it('端数は小数第1位に丸める', () => {
    expect(formatKg(80.3125)).toBe('80.3');
    expect(formatKg(51.875)).toBe('51.9');
  });
  it('丸めて整数になる場合は小数点なし', () => {
    expect(formatKg(79.98)).toBe('80');
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
