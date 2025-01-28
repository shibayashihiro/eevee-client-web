import { Url } from '@/utils/url';
/**
 * "/${$tenantIdenfitifer}`/{paths}" の tenantIdentifier までを除くパスを定義
 */

export const home = '/';

export const loginOrSignUpPage = (srcPageUrl: string) => `/login?src=${encodeURIComponent(srcPageUrl)}`;

export const loginPage = (srcPageUrl: string) => `/auth/login?src=${encodeURIComponent(srcPageUrl)}`;

export const signUpPage = (srcPageUrl: string) => `/auth/signup?src=${encodeURIComponent(srcPageUrl)}`;

export const passwordResetPage = '/password_reset';

export const creditCardAddPage = '/credit_card_add';
export const deliveryAddressAddPage = (srcPageUrl?: string, placeName?: string): Url => ({
  pathname: `/delivery/address_add`,
  query: {
    src: srcPageUrl,
    pla: placeName,
  },
});
export const deliveryCurrentAddressAddPage = ({
  latitude,
  longitude,
  srcPageUrl,
  placeName,
}: {
  latitude?: number;
  longitude?: number;
  srcPageUrl?: string;
  placeName?: string;
}): Url => {
  const query: Record<string, string | undefined> = {
    src: srcPageUrl,
    lat: latitude?.toString(),
    lng: longitude?.toString(),
    pla: placeName,
  };

  Object.keys(query).forEach((key) => query[key] === undefined && delete query[key]);

  return {
    pathname: `/delivery/current_address_add`,
    query,
  };
};
export const deliveryAddressSelectPage = `/delivery/address_select`;

export const shopListPage = '/shops';

export const couponAddPage = '/coupon_add';
export const couponDetailPage = (couponId: string) => `/coupon_detail/${couponId}`;

export const couponPage = ({
  cartId,
  selectedCouponId,
  isTableOrder,
}: {
  /**
   * カートで利用できるクーポンを表示する場合に指定
   */
  cartId?: string;
  /**
   * 選択済みクーポンがある場合に指定
   */
  selectedCouponId?: string;
  /**
   * テーブル注文での会計時に利用できるクーポンを表示する場合に指定
   */
  isTableOrder?: string;
}): Url => {
  const path = `/coupon`;
  const query: { cartId?: string; selectedCouponId?: string; isTableOrder?: string } = {};
  if (cartId) {
    query.cartId = cartId;
  }
  if (selectedCouponId) {
    query.selectedCouponId = selectedCouponId;
  }
  if (isTableOrder) {
    query.isTableOrder = isTableOrder;
  }

  return {
    pathname: path,
    query: {
      ...query,
    },
  };
};

export const privacyPage = '/privacy';

export const linkOrderPage = (orderId: string): string => `/link-order/${orderId}`;

export const subscriptionHomePage = '/subscription';

export const subscriptionPlansPage = '/subscription/plans';

export const mySubscriptionPage = '/my-subscription';

export const mySubscriptionDetailsPage = '/my-subscription/details';

export const mySubscriptionBenefitPage = (benefitId: string): string => `/my-subscription/benefit/${benefitId}`;

export const myPage = '/mypage';
export const myPageCoupon = `${myPage}/coupon`;
export const myPageProfileSetting = `${myPage}/profile-setting`;

export const myPageOrderHistory = `${myPage}/orders`;

export const myPageOrderDetail = (orderId: string, options?: { fromSubmitOrder?: boolean }): string => {
  const path = `${myPageOrderHistory}/${orderId}`;
  if (!options) {
    return path;
  }
  const params = new URLSearchParams();
  if (options.fromSubmitOrder) {
    params.append('fromSubmitOrder', 'true');
  }
  return `${path}?${params.toString()}`;
};

export const myPageOrderCompleted = (orderId: string): string => `${myPageOrderDetail(orderId)}/completed`;

// NOTE: 開発環境のみでアクセス可能なページ
export const debugPage = '/debug/info';
