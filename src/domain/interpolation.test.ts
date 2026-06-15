import { describe, it, expect } from 'vitest';
import { interpolateLevels } from './interpolation';
import { getTable } from '../data/standards';

const bench = getTable('male', 'bench');

describe('interpolateLevels', () => {
  it('男性ベンチ70kg を線形補間（DESIGN.md の例と一致）', () => {
    const r = interpolateLevels(bench, 70);
    expect(r.untrained).toBeCloseTo(51.875, 3);
    expect(r.novice).toBeCloseTo(66.875, 3);
    expect(r.intermediate).toBeCloseTo(80.3125, 4);
    expect(r.advanced).toBeCloseTo(110.3125, 4);
    expect(r.elite).toBeCloseTo(137.1875, 4);
    expect(r.outOfRange).toBe(false);
  });

  it('アンカー値ちょうど（52kg）は範囲内でその値', () => {
    const r = interpolateLevels(bench, 52);
    expect(r.untrained).toBe(37.5);
    expect(r.outOfRange).toBe(false);
  });

  it('最小未満（40kg）は最小行でクランプし範囲外', () => {
    const r = interpolateLevels(bench, 40);
    expect(r.untrained).toBe(37.5); // 52kg 行
    expect(r.outOfRange).toBe(true);
  });

  it('上限超過（200kg）は plus 行を使用し範囲外', () => {
    const r = interpolateLevels(bench, 200);
    expect(r.untrained).toBe(72.5); // 145+ 行
    expect(r.outOfRange).toBe(true);
  });
});
