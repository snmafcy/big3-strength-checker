import type { Exercise } from '../domain/types';
import { EXERCISES } from '../domain/types';
import { EXERCISE_LABEL } from '../domain/labels';

export function ExerciseBottomBar({
  exercise,
  onSelect,
  onOpenSettings,
}: {
  exercise: Exercise;
  onSelect: (e: Exercise) => void;
  onOpenSettings: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch bg-bar pb-[env(safe-area-inset-bottom)]">
      {EXERCISES.map((e) => {
        const active = e === exercise;
        return (
          <button
            key={e}
            type="button"
            onClick={() => onSelect(e)}
            aria-pressed={active}
            className={`relative min-h-[56px] flex-1 font-sans text-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px] ${
              active ? 'font-bold text-primary' : 'text-[oklch(0.72_0_0)]'
            }`}
          >
            {active && <span className="absolute inset-x-0 top-0 h-0.5 bg-primary" />}
            {EXERCISE_LABEL[e]}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="設定"
        onClick={onOpenSettings}
        className="min-h-[56px] px-5 text-xl text-[oklch(0.72_0_0)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px]"
      >
        ⚙
      </button>
    </nav>
  );
}
