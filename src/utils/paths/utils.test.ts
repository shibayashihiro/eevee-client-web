import { isOrderTypePathName } from './utils';

describe('isOrderTypePathName', () => {
  it('should return true for valid order type path names', () => {
    expect(isOrderTypePathName('delivery')).toBe(true);
    expect(isOrderTypePathName('eatin')).toBe(true);
    expect(isOrderTypePathName('takeout')).toBe(true);
  });

  it('should return false for invalid order type path names', () => {
    expect(isOrderTypePathName('invalid')).toBe(false);
    expect(isOrderTypePathName('')).toBe(false);
    expect(isOrderTypePathName('DELIVERY')).toBe(false);
    expect(isOrderTypePathName('eat-in')).toBe(false);
    expect(isOrderTypePathName('take_out')).toBe(false);
  });
});
