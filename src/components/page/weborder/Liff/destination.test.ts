import { handleDestination } from './destination';

describe('Test handleDestination', () => {
  test.each([
    {
      params: {
        queryParams: {
          facilityId: undefined,
          orderType: 'DELIVERY',
        },

        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'home' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'DELIVERY',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'deliveryHome', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'eatInHome', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'TAKEOUT',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'takeoutHome', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
          tableId: 'test',
        },
        courseMenuModeEnabled: true,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'courseMenus', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
          tableId: 'test',
        },
        courseMenuModeEnabled: true,
        alreadyCourseMenuSelected: true,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'checkedIn', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
          tableId: 'test',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: true,
      },
      expected: { type: 'checkedIn', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
          tableId: 'test',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'startCheckIn', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          orderType: 'EAT_IN',
          tableId: 'test',
          debug: 'true',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'debug' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          target: 'mypage',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'mypage', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          target: 'subscription',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'subscription' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          target: 'mystampcard',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'myStampCard', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          target: 'mycoupon',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'myCoupon', facilityId: '1' },
    },
    {
      params: {
        queryParams: {
          facilityId: '1',
          target: 'order',
          orderId: 'test',
        },
        courseMenuModeEnabled: false,
        alreadyCourseMenuSelected: false,
        isCustomerAttributesCollected: false,
      },
      expected: { type: 'order', facilityId: '1', orderId: 'test' },
    },
  ])('returns $expected when params are $params', ({ params, expected }) => {
    const result = handleDestination(params);
    expect(result).toStrictEqual(expected);
  });
});
