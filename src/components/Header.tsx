import type { Gender, Tab } from '../domain/types';
import { TAB_LABEL, GENDER_LABEL } from '../domain/labels';

export function Header({ exercise, gender }: { exercise: Tab; gender: Gender }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-bg px-4 py-3">
      <h1 className="font-sans text-lg font-black tracking-tight text-ink">BIG3 レベルチェッカー</h1>
      <span className="text-sm text-muted">
        {TAB_LABEL[exercise]}・{GENDER_LABEL[gender]}
      </span>
    </header>
  );
}
