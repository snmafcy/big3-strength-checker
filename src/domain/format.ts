/**
 * 体重ラベル用。常に小数第1位まで表示する（例: 70 → "70.0", 78.5 → "78.5"）。
 * 体重はユーザー入力やアンカー値をそのまま見せるため0.5刻みには丸めない（小数1位で丸めのみ）。
 */
export function formatKg(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
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
