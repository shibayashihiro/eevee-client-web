import { safeUserNameForDisplay } from './user';

describe('safeUserNameForDisplay', () => {
  test('should return "ゲストさん" when user is anonymous', () => {
    const result = safeUserNameForDisplay(true, 'John');
    expect(result).toBe('ゲストさん');
  });

  test('should return name with "さん" suffix when name is provided', () => {
    const result = safeUserNameForDisplay(false, '山田太郎');
    expect(result).toBe('山田太郎さん');
  });

  test('should return default fallback text when name is undefined', () => {
    const result = safeUserNameForDisplay(false);
    expect(result).toBe('お名前が未設定です');
  });

  test('should return custom fallback text when provided and name is undefined', () => {
    const result = safeUserNameForDisplay(false, undefined, '未設定ユーザー');
    expect(result).toBe('未設定ユーザー');
  });

  test('should return fallback text when name is empty string', () => {
    const result = safeUserNameForDisplay(false, '');
    expect(result).toBe('お名前が未設定です');
  });
});
