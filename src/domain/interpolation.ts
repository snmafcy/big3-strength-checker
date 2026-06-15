import type { Anchor, StandardsTable } from './types';
import { LEVELS } from './types';

export interface InterpolatedLevels {
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
  outOfRange: boolean;
}

function pickLevels(a: Anchor): Omit<InterpolatedLevels, 'outOfRange'> {
  return {
    untrained: a.untrained,
    novice: a.novice,
    intermediate: a.intermediate,
    advanced: a.advanced,
    elite: a.elite,
  };
}

export function interpolateLevels(table: StandardsTable, bodyweight: number): InterpolatedLevels {
  const closed = table.anchors.filter((a) => !a.plus);
  const plusRow = table.anchors.find((a) => a.plus);
  const min = closed[0];
  const max = closed[closed.length - 1];

  if (bodyweight < min.bodyweight) {
    return { ...pickLevels(min), outOfRange: true };
  }
  if (bodyweight > max.bodyweight) {
    return { ...pickLevels(plusRow ?? max), outOfRange: true };
  }

  for (let i = 0; i < closed.length - 1; i++) {
    const lo = closed[i];
    const hi = closed[i + 1];
    if (bodyweight >= lo.bodyweight && bodyweight <= hi.bodyweight) {
      const t = (bodyweight - lo.bodyweight) / (hi.bodyweight - lo.bodyweight);
      const out = { outOfRange: false } as InterpolatedLevels;
      for (const lv of LEVELS) out[lv] = lo[lv] + (hi[lv] - lo[lv]) * t;
      return out;
    }
  }
  return { ...pickLevels(max), outOfRange: false };
}
