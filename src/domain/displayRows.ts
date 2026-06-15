import type { Anchor, Level, StandardsTable } from './types';
import { LEVELS } from './types';
import { formatKg } from './format';

export interface DisplayRow {
  bodyweight: number;
  label: string;
  plus: boolean;
  values: Record<Level, number>;
  worldRecord: number;
}

function levelValues(a: Anchor): Record<Level, number> {
  const v = {} as Record<Level, number>;
  for (const lv of LEVELS) v[lv] = a[lv];
  return v;
}

/**
 * 表示行は本家ExRxのアンカー行をそのまま用いる（補間はサマリーが担うため、表に中間行は挿入しない）。
 * 末尾に plus 行（例 145+）を付ける。
 */
export function buildDisplayRows(table: StandardsTable): DisplayRow[] {
  return table.anchors.map((a) => ({
    bodyweight: a.bodyweight,
    label: a.plus ? `${formatKg(a.bodyweight)}+` : formatKg(a.bodyweight),
    plus: !!a.plus,
    values: levelValues(a),
    worldRecord: a.worldRecord,
  }));
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
