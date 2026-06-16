import type { SVGProps } from 'react';
import type { Exercise, Tab } from '../domain/types';

const svgBase: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const plate = { fill: 'currentColor', stroke: 'none' as const };

/** BIG3 ピクトグラム。バーの位置と姿勢で種目を示す（掲示板風の硬派な線画）。 */
export function ExerciseIcon({ exercise, className }: { exercise: Exercise; className?: string }) {
  if (exercise === 'bench') {
    // ベンチに横たわりバーを押し上げる：バーベル＋下にベンチ
    return (
      <svg {...svgBase} className={className}>
        <line x1="4" y1="11" x2="24" y2="11" />
        <circle cx="6" cy="11" r="2.4" {...plate} />
        <circle cx="22" cy="11" r="2.4" {...plate} />
        <line x1="7" y1="18" x2="21" y2="18" />
        <line x1="9" y1="18" x2="9" y2="22.5" />
        <line x1="19" y1="18" x2="19" y2="22.5" />
      </svg>
    );
  }
  if (exercise === 'squat') {
    // バーを担いで沈む：上にバーベル＋曲げた脚
    return (
      <svg {...svgBase} className={className}>
        <line x1="4" y1="8" x2="24" y2="8" />
        <circle cx="6" cy="8" r="2.4" {...plate} />
        <circle cx="22" cy="8" r="2.4" {...plate} />
        <line x1="14" y1="8" x2="14" y2="14" />
        <line x1="14" y1="14" x2="9" y2="22" />
        <line x1="14" y1="14" x2="19" y2="22" />
      </svg>
    );
  }
  // deadlift: 床から引き上げる：下にバーベル＋上向きの引き
  return (
    <svg {...svgBase} className={className}>
      <line x1="4" y1="21" x2="24" y2="21" />
      <circle cx="6" cy="21" r="2.4" {...plate} />
      <circle cx="22" cy="21" r="2.4" {...plate} />
      <line x1="14" y1="21" x2="14" y2="9" />
      <polyline points="10,13 14,9 18,13" />
    </svg>
  );
}

/** BIG3 合計：プレートを3枚重ねたスタックでBIG3の総量を示す。 */
export function TotalIcon({ className }: { className?: string }) {
  return (
    <svg {...svgBase} className={className}>
      <line x1="7" y1="7" x2="21" y2="7" />
      <line x1="5.5" y1="14" x2="22.5" y2="14" />
      <line x1="4" y1="21" x2="24" y2="21" />
      <circle cx="9" cy="7" r="1.8" {...plate} />
      <circle cx="19" cy="7" r="1.8" {...plate} />
      <circle cx="7.5" cy="14" r="1.8" {...plate} />
      <circle cx="20.5" cy="14" r="1.8" {...plate} />
      <circle cx="6" cy="21" r="1.8" {...plate} />
      <circle cx="22" cy="21" r="1.8" {...plate} />
    </svg>
  );
}

/** タブ用アイコン。合計は TotalIcon、種目は ExerciseIcon を描画する。 */
export function TabIcon({ tab, className }: { tab: Tab; className?: string }) {
  return tab === 'total' ? (
    <TotalIcon className={className} />
  ) : (
    <ExerciseIcon exercise={tab} className={className} />
  );
}

/** 設定（歯車）。 */
export function GearIcon({ className }: { className?: string }) {
  return (
    <svg {...svgBase} className={className}>
      <circle cx="14" cy="14" r="3.4" />
      <path d="M14 4.5V7 M14 21V23.5 M4.5 14H7 M21 14H23.5 M7.4 7.4l1.8 1.8 M18.8 18.8l1.8 1.8 M20.6 7.4l-1.8 1.8 M9.2 18.8l-1.8 1.8" />
    </svg>
  );
}
