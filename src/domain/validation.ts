export const MIN_BODYWEIGHT = 30;
export const MAX_BODYWEIGHT = 250;

export function validateBodyweight(value: number): string | null {
  if (Number.isNaN(value)) return '数値を入力してください';
  if (value < MIN_BODYWEIGHT) return `${MIN_BODYWEIGHT}〜${MAX_BODYWEIGHT}kgで入力してください`;
  if (value > MAX_BODYWEIGHT) return `${MIN_BODYWEIGHT}〜${MAX_BODYWEIGHT}kgで入力してください`;
  return null;
}
