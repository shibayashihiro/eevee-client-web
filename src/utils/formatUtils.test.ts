import { replaceToUpperAlphaNumerics, toJpPhoneNumber } from './formatUtils';

test('test replaceToUpperAlphaNumerics', () => {
  expect(replaceToUpperAlphaNumerics('a')).toBe('A');
  expect(replaceToUpperAlphaNumerics('A')).toBe('A');
  expect(replaceToUpperAlphaNumerics('あ')).toBe('');
  expect(replaceToUpperAlphaNumerics('abcd123')).toBe('ABCD123');
  expect(replaceToUpperAlphaNumerics('abcd123あああ')).toBe('ABCD123');
  expect(replaceToUpperAlphaNumerics('abc   d123')).toBe('ABCD123');
});

test('test toJpPhoneNumber', () => {
  expect(toJpPhoneNumber('+818012345678')).toBe('+818012345678');
  expect(toJpPhoneNumber('08012345678')).toBe('+818012345678');
});
