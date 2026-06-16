import { describe, it, expect } from 'vitest';
import { tables, getTable, getTotalTable, getTableForTab, source, ageBand } from './standards';
import { LEVELS } from '../domain/types';

describe('standards loader', () => {
  it('6テーブル（男女×BIG3）を読み込む', () => {
    expect(tables).toHaveLength(6);
  });

  it('getTable で該当テーブルを取得し worldRecord に camelCase で変換される', () => {
    const t = getTable('male', 'bench');
    expect(t.gender).toBe('male');
    expect(t.exercise).toBe('bench');
    expect(t.anchors[0].worldRecord).toBe(199.0);
  });

  it('各テーブルのアンカー体重は昇順（plus 行は同値で末尾）', () => {
    for (const t of tables) {
      const closed = t.anchors.filter((a) => !a.plus);
      for (let i = 1; i < closed.length; i++) {
        expect(closed[i].bodyweight).toBeGreaterThan(closed[i - 1].bodyweight);
      }
      expect(t.anchors[t.anchors.length - 1].plus).toBe(true);
    }
  });

  it('全アンカーに5レベルの数値が存在する', () => {
    for (const t of tables) {
      for (const a of t.anchors) {
        for (const lv of LEVELS) expect(typeof a[lv]).toBe('number');
      }
    }
  });

  it('source と ageBand を公開する', () => {
    expect(source).toContain('ExRx');
    expect(ageBand).toBe('18-39');
  });
});

describe('getTotalTable', () => {
  it('各体重で3種目のレベル値・worldRecord を合算する', () => {
    const total = getTotalTable('male');
    const bench = getTable('male', 'bench');
    const squat = getTable('male', 'squat');
    const deadlift = getTable('male', 'deadlift');

    expect(total.exercise).toBe('total');
    expect(total.anchors).toHaveLength(bench.anchors.length);

    total.anchors.forEach((a, i) => {
      expect(a.bodyweight).toBe(bench.anchors[i].bodyweight);
      expect(a.plus).toBe(bench.anchors[i].plus);
      for (const lv of LEVELS) {
        expect(a[lv]).toBeCloseTo(
          bench.anchors[i][lv] + squat.anchors[i][lv] + deadlift.anchors[i][lv],
        );
      }
      expect(a.worldRecord).toBeCloseTo(
        bench.anchors[i].worldRecord + squat.anchors[i].worldRecord + deadlift.anchors[i].worldRecord,
      );
    });
  });

  it('getTableForTab は total で合計テーブル、種目で個別テーブルを返す', () => {
    expect(getTableForTab('female', 'total').exercise).toBe('total');
    expect(getTableForTab('female', 'squat').exercise).toBe('squat');
  });
});
