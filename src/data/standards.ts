import raw from './strength_standards.json';
import { EXERCISES, LEVELS } from '../domain/types';
import type { Anchor, Exercise, Gender, StandardsTable, Tab } from '../domain/types';

interface RawAnchor {
  bodyweight: number;
  plus?: boolean;
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
  world_record: number;
}
interface RawTable { gender: string; exercise: string; anchors: RawAnchor[] }
interface RawData { unit: string; age_band: string; source: string; tables: RawTable[] }

const data = raw as RawData;

function toAnchor(r: RawAnchor): Anchor {
  return {
    bodyweight: r.bodyweight,
    plus: r.plus,
    untrained: r.untrained,
    novice: r.novice,
    intermediate: r.intermediate,
    advanced: r.advanced,
    elite: r.elite,
    worldRecord: r.world_record,
  };
}

export const tables: StandardsTable[] = data.tables.map((t) => ({
  gender: t.gender as Gender,
  exercise: t.exercise as Exercise,
  anchors: t.anchors.map(toAnchor),
}));

export const source = data.source;
export const ageBand = data.age_band;

export function getTable(gender: Gender, exercise: Exercise): StandardsTable {
  const table = tables.find((t) => t.gender === gender && t.exercise === exercise);
  if (!table) throw new Error(`No table for ${gender} ${exercise}`);
  return table;
}

/** BIG3 合計テーブルを合成する。3種目のアンカーを体重で突き合わせ、各レベル値と worldRecord を行ごとに合算する。 */
export function getTotalTable(gender: Gender): StandardsTable {
  const [bench, squat, deadlift] = EXERCISES.map((e) => getTable(gender, e));
  const len = bench.anchors.length;
  if (squat.anchors.length !== len || deadlift.anchors.length !== len) {
    throw new Error(`Anchor count mismatch for ${gender} total`);
  }

  const anchors: Anchor[] = bench.anchors.map((b, i) => {
    const s = squat.anchors[i];
    const d = deadlift.anchors[i];
    if (b.bodyweight !== s.bodyweight || b.bodyweight !== d.bodyweight || b.plus !== s.plus || b.plus !== d.plus) {
      throw new Error(`Anchor mismatch at row ${i} for ${gender} total`);
    }
    const sum = { bodyweight: b.bodyweight, plus: b.plus, worldRecord: b.worldRecord + s.worldRecord + d.worldRecord } as Anchor;
    for (const lv of LEVELS) sum[lv] = b[lv] + s[lv] + d[lv];
    return sum;
  });

  return { gender, exercise: 'total', anchors };
}

export function getTableForTab(gender: Gender, tab: Tab): StandardsTable {
  return tab === 'total' ? getTotalTable(gender) : getTable(gender, tab);
}
