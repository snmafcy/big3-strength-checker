import type { InterpolatedLevels } from '../domain/interpolation';
import { LEVELS } from '../domain/types';
import { LEVEL_LABEL, LEVEL_COLOR_VAR } from '../domain/labels';
import { formatKg, formatStandard } from '../domain/format';

export function SummaryBand({ bodyweight, levels }: { bodyweight: number; levels: InterpolatedLevels }) {
  return (
    <section className="my-4 border-y border-hairline py-4">
      <h2 className="mb-3 flex items-center gap-2 font-sans text-base font-bold text-ink">
        あなた(<span className="tabular">{formatKg(bodyweight)}</span>kg)の目安 (kg)
        {levels.outOfRange && (
          <span className="rounded-sm bg-warn px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-warn-ink">
            範囲外
          </span>
        )}
      </h2>
      <dl className="grid grid-cols-5 gap-x-3 text-center">
        {LEVELS.map((lv) => (
          <div key={lv}>
            <dt className="mb-1 text-[11px] font-bold tracking-wide" style={{ color: LEVEL_COLOR_VAR[lv] }}>
              {LEVEL_LABEL[lv]}
            </dt>
            <dd className="tabular text-lg font-bold tracking-tight text-ink sm:text-xl">
              {formatStandard(levels[lv])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
