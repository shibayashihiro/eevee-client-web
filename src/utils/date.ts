/**
 * 二つの日付の間の違いを分単位で計算し、その結果を常に整数で返します。
 * 分の単位での結果は最も近い整数に切り上げられます
 *
 * @param {Date} from - 開始日付オブジェクト
 * @param {Date} to - 終了日付オブジェクト
 * @return {number} 開始日から終了日までの違い（分単位）を四捨五入した結果
 */
export function getMinutesDiff(from: Date, to: Date): number {
  const diffInMilliSeconds = to.getTime() - from.getTime();
  const diffInMinutes = Math.ceil(diffInMilliSeconds / (1000 * 60));
  return diffInMinutes;
}

/**
 * Returns true if date1 is after date2, otherwise false.
 *
 * @param {Date} date1 - The first date to compare.
 * @param {Date} date2 - The second date to compare.
 * @return {boolean} - true if date1 is after date2, false otherwise.
 */
export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}
