import { validatePhoneNumber } from './validator';

test('test validatePhoneNumber', () => {
  expect(validatePhoneNumber('08012345678')).toBe(true);
  expect(validatePhoneNumber('080123456789')).toBe(false);
  expect(validatePhoneNumber('0801234567')).toBe(false);

  expect(validatePhoneNumber('0312345678')).toBe(false);

  expect(validatePhoneNumber('080-1234-5678')).toBe(true);
  expect(validatePhoneNumber('080-12345678')).toBe(true);
  expect(validatePhoneNumber('0801234-5678')).toBe(true);
  expect(validatePhoneNumber('080-1234-567')).toBe(false);
  expect(validatePhoneNumber('080-1234567')).toBe(false);
  expect(validatePhoneNumber('0801234-567')).toBe(false);

  // ハイフンあり11桁のテスト
  expect(validatePhoneNumber('080-1234-56')).toBe(false);
  expect(validatePhoneNumber('080-123456')).toBe(false);
  expect(validatePhoneNumber('0801234-56')).toBe(false);
});
