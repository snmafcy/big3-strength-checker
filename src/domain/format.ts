/** 体重ラベル用。整数は小数点なし、端数は小数第1位まで。 */
export function formatKg(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** 最近接の0.5刻みに丸める（本家ExRxの基準値はすべて .0/.5 刻み）。 */
export function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * 強度値（各レベル・World Record・サマリー）の表示用。
 * 0.5刻みに丸め、常に小数第1位まで表示する（例: 80 → "80.0", 80.3125 → "80.5"）。
 */
export function formatStandard(value: number): string {
  return roundToHalf(value).toFixed(1);
}
