/**
 * ユーザーに対して表示する用の名前を返す
 * @param name
 * @param isAnonymous
 */
export const safeUserNameForDisplay = (
  isAnonymous: boolean,
  name?: string | null,
  fallbackText: string = 'お名前が未設定です',
): string => {
  if (isAnonymous) {
    return 'ゲストさん';
  }
  if (!name) {
    return fallbackText;
  }
  return `${name}さん`;
};
