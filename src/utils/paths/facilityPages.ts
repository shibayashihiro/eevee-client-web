/**
 * "/${$tenantIdenfitifer}`/f/${facilityId}/{paths}" の facilityId までを除くパスを定義
 */

import { UrlObject } from 'url';

import { OrderType } from '@/graphql/generated/types';

const PREFIX = '/f';

export const deliveryHome = (facilityId: string) => `${PREFIX}/${facilityId}/delivery`;
export const eatInHome = (facilityId: string) => `${PREFIX}/${facilityId}/eatin`;
export const takeoutHome = (facilityId: string) => `${PREFIX}/${facilityId}/takeout`;
export const myPageHome = (facilityId: string) => `${PREFIX}/${facilityId}/mypage`;
export const myPageStampCard = (facilityId: string) => `${PREFIX}/${facilityId}/mypage/stampcard`;
export const myPageCoupon = (facilityId: string) => `${PREFIX}/${facilityId}/mypage/coupon`;

export const cartPage = (facilityId: string, orderType: OrderType): UrlObject => {
  return {
    pathname: `${PREFIX}/${facilityId}/cart`,
    query: {
      orderType: orderType,
    },
  };
};

export const tableOrderCartPage = (facilityId: string): UrlObject => {
  return {
    pathname: `${PREFIX}/${facilityId}/cart`,
    query: {
      orderType: OrderType.EatIn,
      tableOrder: '',
    },
  };
};

export const menuItemDetailPage = (
  facilityId: string,
  menuItemId: string,
  orderType: OrderType,
  orderItemId?: string | null,
): string => {
  const params = new URLSearchParams({ orderType: orderType });
  if (orderItemId) {
    params.append('orderItemId', orderItemId);
  }
  return `${PREFIX}/${facilityId}/menuitem/${menuItemId}?${params.toString()}`;
};

export const menuCategoryDetailPage = (facilityId: string, menuCategoryId: string, orderType: OrderType): string => {
  const params = new URLSearchParams({ orderType: orderType });
  return `${PREFIX}/${facilityId}/menucategory/${menuCategoryId}?${params.toString()}`;
};

export const orderDetailPage = (facilityId: string, orderId: string, orderType: OrderType): UrlObject => ({
  pathname: `${PREFIX}/${facilityId}/order/${orderId}`,
  query: {
    // NOTE: ページコンポーネント内でOrderTypeは使っていないが、戻り先のHome画面を解決するためだけに使っている
    orderType: orderType,
  },
});

export const tableOrdersPage = (facilityId: string): string => `${PREFIX}/${facilityId}/table/orders`;

export const tableCheckInPage = (facilityId: string, tableId: string): UrlObject => ({
  pathname: `${PREFIX}/${facilityId}/table/${tableId}/checkin`,
});

export const courseMenusPage = (facilityId: string, tableId: string): string => {
  return `${PREFIX}/${facilityId}/table/${tableId}/menus`;
};

export const courseMenuPage = (facilityId: string, tableId: string, courseMenuId: string): string => {
  // UrlObjectを使わない(UrlObjectを使わない)方が将来的に嬉しいので、少しずつ依存をやめている
  return `${courseMenusPage(facilityId, tableId)}/${courseMenuId}`;
};

export const courseMenusSuggestionsPage = (facilityId: string, tableId: string, courseMenuId: string): string => {
  return `${courseMenuPage(facilityId, tableId, courseMenuId)}/suggestions`;
};

export const courseMenusCartPage = (facilityId: string, tableId: string): string => {
  return `${courseMenusPage(facilityId, tableId)}/cart`;
};

export const courseMenuAsMenuItemDetailPage = (
  facilityId: string,
  courseMenuId: string,
  // 編集画面で初期値を設定するための情報
  selectedQuantityByEntryId?: { [entryId: string]: number },
): string => {
  const path = `${PREFIX}/${facilityId}/coursemenu/${courseMenuId}`;
  if (!selectedQuantityByEntryId) {
    return path;
  }
  const params = new URLSearchParams();
  for (const [entryId, quantity] of Object.entries(selectedQuantityByEntryId)) {
    params.append('selectedEntryIds', entryId);
    params.append('selectedEntryQuantities', quantity.toString());
  }
  return `${path}?${params.toString()}`;
};

export const searchItemPage = (facilityId: string, orderType: OrderType): UrlObject => {
  return {
    pathname: `${PREFIX}/${facilityId}/searchitem`,
    query: {
      orderType: orderType,
    },
  };
};

export const orderDateSelectionPage = (facilityId: string): UrlObject => {
  return {
    pathname: `${PREFIX}/${facilityId}/orderdateselection`,
  };
};

export const initialHome = (facilityId: string, orderType: OrderType): string => {
  const params = new URLSearchParams({ orderType: orderType });
  return `${PREFIX}/${facilityId}/initialhome?${params.toString()}`;
};

export const surveyPage = (facilityId: string, surveyId: string): string => {
  return `${PREFIX}/${facilityId}/survey/${surveyId}`;
};

export const surveyEndPage = (facilityId: string, surveyId: string): string => {
  return `${PREFIX}/${facilityId}/survey/${surveyId}/end`;
};

export const orderPage = (facilityId: string, orderId: string) => {
  return `${PREFIX}/${facilityId}/order/${orderId}`;
};
