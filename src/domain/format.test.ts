import { describe, it, expect } from 'vitest';
import { formatKg } from './format';

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
