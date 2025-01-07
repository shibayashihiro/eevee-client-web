import { dateToInputString, inputDateStringToDateObj } from './schema';

describe('birthDateToInputString', () => {
  it('should generate correctly formatted string', () => {
    const birthDate = {
      year: 2024,
      month: 1,
      day: 1,
    };
    expect(dateToInputString(birthDate)).toBe('20240101');
  });

  it('should pad single digit month and day with zeros', () => {
    const birthDate = {
      year: 2024,
      month: 1,
      day: 1,
    };
    expect(dateToInputString(birthDate)).toBe('20240101');
  });

  it('should pad year to four digits', () => {
    const birthDate = {
      year: 24,
      month: 12,
      day: 31,
    };
    expect(dateToInputString(birthDate)).toBe('00241231');
  });

  it('should pad all single digit values with zeros', () => {
    const birthDate = {
      year: 1,
      month: 1,
      day: 1,
    };
    expect(dateToInputString(birthDate)).toBe('00010101');
  });
});

describe('inputDateStringToDateObj', () => {
  it('should convert valid date string to DateObject', () => {
    const result = inputDateStringToDateObj('20240101');
    expect(result).toEqual({
      year: 2024,
      month: 1,
      day: 1,
    });
  });

  it('should handle last day of month correctly', () => {
    const result = inputDateStringToDateObj('20241231');
    expect(result).toEqual({
      year: 2024,
      month: 12,
      day: 31,
    });
  });

  it('should handle month conversion from 0-based to 1-based', () => {
    const result = inputDateStringToDateObj('20240201');
    expect(result).toEqual({
      year: 2024,
      month: 2, // 確実に1-basedになっていることを確認
      day: 1,
    });
  });

  it('should throw error for invalid date string', () => {
    // 不正な月
    expect(() => inputDateStringToDateObj('20241301')).toThrow();
    // 不正な日
    expect(() => inputDateStringToDateObj('20240132')).toThrow();
    // 短い文字列
    expect(() => inputDateStringToDateObj('2024010')).toThrow();
    // 長い文字列
    expect(() => inputDateStringToDateObj('202401011')).toThrow();
  });
});
