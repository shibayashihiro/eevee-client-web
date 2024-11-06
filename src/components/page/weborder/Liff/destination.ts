import { ParsedUrlQuery } from 'querystring';

import { OrderType } from '@/graphql/generated/types';

type Destination =
  | DestinationTenantHome
  | DestinationDeliveryHome
  | DestinationEatInHome
  | DestinationTakeoutHome
  | DestinationCourseMenus
  | DestinationStartCheckIn
  | DestinationAlreadyCheckedIn
  | DestinationLinkOrder
  | DestinationMypage
  | DestinationMyStampCard
  | DestinationMyCoupon
  | DestinationSubscription
  | DestinationDebug
  | DestinationOrder;

type DestinationTenantHome = {
  type: 'home';
};

type DestinationDeliveryHome = {
  type: 'deliveryHome';
  facilityId: string;
};

type DestinationEatInHome = {
  type: 'eatInHome';
  facilityId: string;
};

type DestinationTakeoutHome = {
  type: 'takeoutHome';
  facilityId: string;
};

type DestinationCourseMenus = {
  type: 'courseMenus';
  facilityId: string;
};

type DestinationStartCheckIn = {
  type: 'startCheckIn';
  facilityId: string;
};

type DestinationAlreadyCheckedIn = {
  type: 'checkedIn';
  facilityId: string;
};

type DestinationLinkOrder = {
  type: 'linkOrder';
  linkOrderId: string;
};

type DestinationMypage = {
  type: 'mypage';
  facilityId: string;
};

type DestinationMyStampCard = {
  type: 'myStampCard';
  facilityId: string;
};

type DestinationMyCoupon = {
  type: 'myCoupon';
  facilityId: string;
};

type DestinationSubscription = {
  type: 'subscription';
};

type DestinationDebug = {
  type: 'debug';
};

type DestinationOrder = {
  type: 'order';
  facilityId: string;
  orderId: string;
};

type Params = {
  queryParams: ParsedUrlQuery;
  courseMenuModeEnabled: boolean;
  alreadyCourseMenuSelected: boolean;
  isCustomerAttributesCollected: boolean;
};

export function handleDestination({
  queryParams,
  courseMenuModeEnabled,
  alreadyCourseMenuSelected,
  isCustomerAttributesCollected,
}: Params): Destination {
  if (hasProperty(queryParams, 'debug') && queryParams.debug === 'true') {
    return { type: 'debug' };
  }

  if (hasProperty(queryParams, 'linkOrderId')) {
    return { type: 'linkOrder', linkOrderId: queryParams.linkOrderId };
  }

  if (hasProperty(queryParams, 'target')) {
    switch (queryParams.target) {
      case 'mypage':
        if (!hasProperty(queryParams, 'facilityId')) {
          throw new Error('facilityId is required');
        }
        return { type: 'mypage', facilityId: queryParams.facilityId };
      case 'mystampcard':
        if (!hasProperty(queryParams, 'facilityId')) {
          throw new Error('facilityId is required');
        }
        return { type: 'myStampCard', facilityId: queryParams.facilityId };
      case 'mycoupon':
        if (!hasProperty(queryParams, 'facilityId')) {
          throw new Error('facilityId is required');
        }
        return { type: 'myCoupon', facilityId: queryParams.facilityId };
      case 'subscription':
        return { type: 'subscription' };
      case 'order':
        if (!hasProperty(queryParams, 'facilityId')) {
          throw new Error('facilityId is required');
        }
        if (!hasProperty(queryParams, 'orderId')) {
          throw new Error('orderId is required');
        }
        return { type: 'order', facilityId: queryParams.facilityId, orderId: queryParams.orderId };
      default:
        throw new Error(`Invalid target: ${queryParams.target}`);
    }
  }

  if (!hasProperty(queryParams, 'facilityId')) {
    return { type: 'home' };
  }

  if (!hasProperty(queryParams, 'tableId')) {
    switch (queryParams.orderType) {
      case OrderType.Delivery:
        return { type: 'deliveryHome', facilityId: queryParams.facilityId };
      case OrderType.EatIn:
        return { type: 'eatInHome', facilityId: queryParams.facilityId };
      case OrderType.Takeout:
        return { type: 'takeoutHome', facilityId: queryParams.facilityId };
    }
    // デフォルトはイートインページを返す。(LINEミニアプリはイートインが基本のため)
    return { type: 'eatInHome', facilityId: queryParams.facilityId };
  }

  // コースメニューモードが有効なケース
  if (courseMenuModeEnabled) {
    if (alreadyCourseMenuSelected) {
      return { type: 'checkedIn', facilityId: queryParams.facilityId };
    }
    return { type: 'courseMenus', facilityId: queryParams.facilityId };
  }

  // 以降、コースメニューなしの従来テーブル注文ケース
  if (isCustomerAttributesCollected) {
    return { type: 'checkedIn', facilityId: queryParams.facilityId };
  }

  return { type: 'startCheckIn', facilityId: queryParams.facilityId };
}

function hasProperty<T extends string>(
  queryParams: ParsedUrlQuery,
  key: T,
): queryParams is ParsedUrlQuery & Record<T, string> {
  return typeof queryParams[key] === 'string';
}
