import type { Tab } from '../domain/types';
import { TABS } from '../domain/types';
import { TAB_LABEL } from '../domain/labels';
import { TabIcon, GearIcon } from './icons';

export function ExerciseBottomBar({
  exercise,
  onSelect,
  onOpenSettings,
}: {
  exercise: Tab;
  onSelect: (e: Tab) => void;
  onOpenSettings: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch bg-bar pb-[env(safe-area-inset-bottom)]">
      {TABS.map((e) => {
        const active = e === exercise;
        return (
          <button
            key={e}
            type="button"
            onClick={() => onSelect(e)}
            aria-pressed={active}
            className={`relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 font-sans focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px] ${
              active ? 'font-bold text-primary' : 'text-[oklch(0.72_0_0)]'
            }`}
          >
            {active && <span className="absolute inset-x-0 top-0 h-0.5 bg-primary" />}
            <TabIcon tab={e} className="h-6 w-6" />
            <span className="text-[10px] leading-none tracking-wide">{TAB_LABEL[e]}</span>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="設定"
        onClick={onOpenSettings}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 px-4 font-sans text-[oklch(0.72_0_0)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:[outline-offset:-2px]"
      >
        <GearIcon className="h-6 w-6" />
        <span className="text-[10px] leading-none tracking-wide">設定</span>
      </button>
    </nav>
  );
}
