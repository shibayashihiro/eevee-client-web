import { resolveNotificationDialogState } from './LastOrderTimer';

describe('test resolveNotificationDialogState', () => {
  // 残り時間が10分より多い場合
  test('should return close when minutesLeft is greater than 10', () => {
    const result = resolveNotificationDialogState({
      minutesLeft: 11,
      alreadyReadTenMinutesNotice: false,
      alreadyReadLastOrderPassedNotice: false,
    });
    expect(result).toBe('close');
  });

  // 残り10分以内
  describe('when minutesLeft is less than or equal to 10', () => {
    test('should return show-last-10-minutes when notice is not read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 10,
        alreadyReadTenMinutesNotice: false,
        alreadyReadLastOrderPassedNotice: false,
      });
      expect(result).toBe('show-last-10-minutes');
    });

    test('should return close when 10-minutes notice is already read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 10,
        alreadyReadTenMinutesNotice: true,
        alreadyReadLastOrderPassedNotice: false,
      });
      expect(result).toBe('close');
    });
  });

  // 残り時間が0分以下
  describe('when minutesLeft is less than or equal to 0', () => {
    test('should return show-last-order-passed when notice is not read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 0,
        alreadyReadTenMinutesNotice: false,
        alreadyReadLastOrderPassedNotice: false,
      });
      expect(result).toBe('show-last-order-passed');
    });

    test('should return close when last-order-passed notice is already read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 0,
        alreadyReadTenMinutesNotice: false,
        alreadyReadLastOrderPassedNotice: true,
      });
      expect(result).toBe('close');
    });

    test('should return show-last-order-passed when time is negative and notice is not read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 0,
        alreadyReadTenMinutesNotice: false,
        alreadyReadLastOrderPassedNotice: false,
      });
      expect(result).toBe('show-last-order-passed');
    });
  });

  describe('edge cases', () => {
    test('should handle both notices being read', () => {
      const result = resolveNotificationDialogState({
        minutesLeft: 0,
        alreadyReadTenMinutesNotice: true,
        alreadyReadLastOrderPassedNotice: true,
      });
      expect(result).toBe('close');
    });
  });
});
