import { describe, it, expect } from 'vitest';
import { buildDisplayRows, findClosestRowIndex } from './displayRows';
import { getTable } from '../data/standards';

const bench = getTable('male', 'bench'); // closed: 52,56,60,67,75,82,90,100,110,125,145 + 145plus

describe('buildDisplayRows', () => {
  const rows = buildDisplayRows(bench);

  it('≤100kg は中間行を挿入し >100kg は元アンカーのみ、末尾に plus 行', () => {
    // closed 11 + 中間 7 (52-56,56-60,60-67,67-75,75-82,82-90,90-100) + plus 1 = 19
    expect(rows).toHaveLength(19);
    expect(rows[0].label).toBe('52.0');
    expect(rows[rows.length - 1].label).toBe('145.0+');
    expect(rows[rows.length - 1].plus).toBe(true);
  });

  it('67kg と 75kg の間に中間体重 71 の補間行が入る', () => {
    const mid = rows.find((r) => r.label === '71.0');
    expect(mid).toBeDefined();
    expect(mid!.interpolated).toBe(true);
  });

  it('100kg 超には中間行を挿入しない（105 は存在しない）', () => {
    expect(rows.some((r) => r.label === '105.0')).toBe(false);
  });

  it('中間行の値は両端の平均', () => {
    const mid = rows.find((r) => r.label === '71.0')!;
    // 67kg intermediate 77.5, 75kg intermediate 85 → 平均 81.25
    expect(mid.values.intermediate).toBeCloseTo(81.25, 2);
  });

  it('各行に worldRecord を持ち、中間行は両端の平均', () => {
    // 52kg アンカーの WR は 199.0
    expect(rows[0].worldRecord).toBe(199);
    // 52-56 の中間行(54): (199+207)/2 = 203
    const mid54 = rows.find((r) => r.label === '54.0')!;
    expect(mid54.worldRecord).toBeCloseTo(203, 5);
    // plus 行(145+)の WR は 355.0
    expect(rows[rows.length - 1].worldRecord).toBe(355);
  });
});

describe('findClosestRowIndex', () => {
  const rows = buildDisplayRows(bench);
  it('体重70kg に最も近いのは 71 の行', () => {
    const idx = findClosestRowIndex(rows, 70);
    expect(rows[idx].label).toBe('71.0');
  });
});
