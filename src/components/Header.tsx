import type { Exercise, Gender } from '../domain/types';
import { EXERCISE_LABEL, GENDER_LABEL } from '../domain/labels';

export function Header({ exercise, gender }: { exercise: Exercise; gender: Gender }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-bg px-4 py-3">
      <h1 className="font-sans text-lg font-black tracking-tight text-ink">BIG3 レベルチェッカー</h1>
      <span className="text-sm text-muted">
        {EXERCISE_LABEL[exercise]}・{GENDER_LABEL[gender]}
      </span>
    </header>
  );
}
