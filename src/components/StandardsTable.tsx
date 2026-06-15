import type { DisplayRow } from '../domain/displayRows';
import { LEVELS } from '../domain/types';
import { LEVEL_LABEL, LEVEL_COLOR_VAR } from '../domain/labels';
import { formatKg } from '../domain/format';

export function StandardsTable({ rows, highlightIndex }: { rows: DisplayRow[]; highlightIndex: number }) {
  return (
    <table className="w-full border-collapse text-right text-sm">
      <thead>
        <tr>
          <th className="sticky top-[57px] z-[5] bg-surface-sunken px-1.5 py-2 text-left font-sans text-[11px] font-bold tracking-wide text-muted">
            体重
          </th>
          {LEVELS.map((lv) => (
            <th
              key={lv}
              className="sticky top-[57px] z-[5] bg-surface-sunken px-1.5 py-2 font-sans text-[11px] font-bold tracking-wide"
              style={{ color: LEVEL_COLOR_VAR[lv] }}
            >
              {LEVEL_LABEL[lv]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const isHighlight = i === highlightIndex;
          return (
            <tr
              key={`${r.label}-${i}`}
              data-testid={isHighlight ? 'highlight-row' : undefined}
              aria-current={isHighlight ? 'true' : undefined}
              className={
                isHighlight
                  ? 'bg-primary-tint font-bold [box-shadow:inset_0_2px_0_var(--color-primary),inset_0_-2px_0_var(--color-primary)]'
                  : i % 2 === 1
                    ? 'bg-surface'
                    : ''
              }
            >
              <td className="tabular px-1.5 py-2 text-left text-ink">
                {isHighlight && <span className="mr-1 text-primary">▶</span>}
                {r.label}
              </td>
              {LEVELS.map((lv) => (
                <td key={lv} className="tabular px-1.5 py-2 text-ink">
                  {formatKg(r.values[lv])}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
