import { getMinutesDiff, isAfter } from './date';

test.each([
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T01:30:00Z'), 90],
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T00:00:01Z'), 1], // 1秒でも1分としてカウント
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T00:00:30Z'), 1], // 30秒でも1分としてカウント
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T00:01:00Z'), 1], // 正確に1分
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T00:01:30Z'), 2], // 1分30秒は2分としてカウント
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-14T23:00:00Z'), -60], // 開始時刻が終了時刻より後の場合
  [new Date('2024-02-15T00:00:00Z'), new Date('2024-02-15T00:00:00Z'), 0], // 同じ時刻
])('calculates the correct difference in minutes', (date1, date2, expectedDifference) => {
  expect(getMinutesDiff(date1, date2)).toBe(expectedDifference);
});

test.each([
  [new Date('2024-02-26'), new Date('2024-02-27'), false],
  [new Date('2024-02-27'), new Date('2024-02-26'), true],
  [new Date('2024-02-26'), new Date('2024-02-26'), false],
  [new Date('2024-02-26T12:00:00'), new Date('2024-02-26T12:00:01'), false],
  [new Date('2024-02-26T12:00:01'), new Date('2024-02-26T12:00:00'), true],
  [new Date('2024-02-26T12:01:00'), new Date('2024-02-26T12:00:00'), true],
])('checks if date1 is after date2', (date1, date2, expectedResult) => {
  expect(isAfter(date1, date2)).toBe(expectedResult);
});
