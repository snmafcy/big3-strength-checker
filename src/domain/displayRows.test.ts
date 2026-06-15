import { describe, it, expect } from 'vitest';
import { buildDisplayRows, filterDisplayRows, findClosestRowIndex } from './displayRows';
import { getTable } from '../data/standards';

const bench = getTable('male', 'bench'); // anchors: 52,56,60,67,75,82,90,100,110,125,145 + 145plus

describe('buildDisplayRows', () => {
  const rows = buildDisplayRows(bench);

  it('本家アンカー行をそのまま用い、中間行は挿入しない（末尾に plus 行）', () => {
    // closed 11 + plus 1 = 12（中間補間行は無し）
    expect(rows).toHaveLength(12);
    expect(rows[0].label).toBe('52.0');
    expect(rows.some((r) => r.label === '71.0')).toBe(false); // 中間行は無い
    expect(rows[rows.length - 1].label).toBe('145.0+');
    expect(rows[rows.length - 1].plus).toBe(true);
  });

  it('各行はアンカーのレベル値と worldRecord を持つ', () => {
    expect(rows[0].values.intermediate).toBe(60); // 52kg intermediate
    expect(rows[0].worldRecord).toBe(199); // 52kg WR
    expect(rows[rows.length - 1].worldRecord).toBe(355); // 145+ WR
  });
});

describe('filterDisplayRows', () => {
  const rows = buildDisplayRows(bench);

  it('showHeavy=false は 125kg以降（125/145/145+）を除外し末尾が 110.0', () => {
    const filtered = filterDisplayRows(rows, false);
    expect(filtered.every((r) => r.bodyweight < 125)).toBe(true);
    expect(filtered.some((r) => r.plus)).toBe(false);
    expect(filtered[filtered.length - 1].label).toBe('110.0');
  });

  it('showHeavy=true は全行（plus 含む）を保持', () => {
    const filtered = filterDisplayRows(rows, true);
    expect(filtered).toHaveLength(rows.length);
    expect(filtered[filtered.length - 1].label).toBe('145.0+');
  });
});

describe('findClosestRowIndex', () => {
  const rows = buildDisplayRows(bench);
  it('体重70kg に最も近いアンカーは 67 の行', () => {
    const idx = findClosestRowIndex(rows, 70);
    expect(rows[idx].label).toBe('67.0');
  });
});
