import type { Anchor, Level, StandardsTable } from './types';
import { LEVELS } from './types';
import { formatKg } from './format';

export interface DisplayRow {
  bodyweight: number;
  label: string;
  plus: boolean;
  interpolated: boolean;
  values: Record<Level, number>;
  worldRecord: number;
}

function levelValues(a: Anchor): Record<Level, number> {
  const v = {} as Record<Level, number>;
  for (const lv of LEVELS) v[lv] = a[lv];
  return v;
}

function anchorRow(a: Anchor): DisplayRow {
  return {
    bodyweight: a.bodyweight,
    label: formatKg(a.bodyweight),
    plus: false,
    interpolated: false,
    values: levelValues(a),
    worldRecord: a.worldRecord,
  };
}

export function buildDisplayRows(table: StandardsTable): DisplayRow[] {
  const closed = table.anchors.filter((a) => !a.plus);
  const plusRow = table.anchors.find((a) => a.plus);
  const rows: DisplayRow[] = [];

  for (let i = 0; i < closed.length; i++) {
    const a = closed[i];
    rows.push(anchorRow(a));
    const next = closed[i + 1];
    if (next && a.bodyweight <= 100 && next.bodyweight <= 100) {
      const mid = (a.bodyweight + next.bodyweight) / 2;
      const values = {} as Record<Level, number>;
      for (const lv of LEVELS) values[lv] = (a[lv] + next[lv]) / 2;
      rows.push({
        bodyweight: mid,
        label: formatKg(mid),
        plus: false,
        interpolated: true,
        values,
        worldRecord: (a.worldRecord + next.worldRecord) / 2,
      });
    }
  }

  if (plusRow) {
    rows.push({
      bodyweight: plusRow.bodyweight,
      label: `${formatKg(plusRow.bodyweight)}+`,
      plus: true,
      interpolated: false,
      values: levelValues(plusRow),
      worldRecord: plusRow.worldRecord,
    });
  }
  return rows;
}

/** これ以上（含む）の体重行は「重量級」とみなし、オプション表示の対象とする。 */
export const HEAVY_ROW_THRESHOLD = 125;

/** showHeavy が false のとき、125kg以降の行（125/145/145+）を除外する。 */
export function filterDisplayRows(rows: DisplayRow[], showHeavy: boolean): DisplayRow[] {
  return showHeavy ? rows : rows.filter((r) => r.bodyweight < HEAVY_ROW_THRESHOLD);
}

export function findClosestRowIndex(rows: DisplayRow[], bodyweight: number): number {
  let best = 0;
  let bestDist = Infinity;
  rows.forEach((r, i) => {
    const dist = Math.abs(r.bodyweight - bodyweight);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}
