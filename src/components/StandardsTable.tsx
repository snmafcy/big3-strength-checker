import type { DisplayRow } from '../domain/displayRows';
import { LEVELS } from '../domain/types';
import { LEVEL_LABEL, LEVEL_COLOR_VAR } from '../domain/labels';
import { formatStandard } from '../domain/format';

export function StandardsTable({
  rows,
  highlightIndex,
  showWorldRecord,
}: {
  rows: DisplayRow[];
  highlightIndex: number;
  showWorldRecord: boolean;
}) {
  return (
    <table className="w-full border-collapse text-right text-xs">
      <thead>
        <tr>
          <th className="sticky top-[57px] z-[5] bg-surface-sunken px-1 py-2 text-left align-bottom font-sans text-[11px] font-bold tracking-wide text-muted">
            体重
          </th>
          {LEVELS.map((lv) => (
            <th
              key={lv}
              className="sticky top-[57px] z-[5] bg-surface-sunken px-1 py-2 align-bottom font-sans text-[11px] font-bold tracking-wide"
              style={{ color: LEVEL_COLOR_VAR[lv] }}
            >
              {LEVEL_LABEL[lv]}
            </th>
          ))}
          {/* World Record は到達目標ではなく「参考記録」。熱量ランプ色を使わず muted＋ヘアライン仕切りで分離する。 */}
          {showWorldRecord && (
            <th
              scope="col"
              className="sticky top-[57px] z-[5] border-l border-hairline bg-surface-sunken px-1 py-2 align-bottom font-sans text-[11px] font-bold leading-tight tracking-wide text-muted"
            >
              世界記録
            </th>
          )}
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
              <td className="tabular px-1 py-2 text-left text-ink">
                <span className="mr-0.5 inline-block w-3 text-primary">{isHighlight ? '▶' : ''}</span>
                {r.label}
              </td>
              {LEVELS.map((lv) => (
                <td key={lv} className="tabular px-1 py-2 text-ink">
                  {formatStandard(r.values[lv])}
                </td>
              ))}
              {showWorldRecord && (
                <td className="tabular border-l border-hairline px-1 py-2 text-ink">
                  {formatStandard(r.worldRecord)}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
