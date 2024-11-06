import { Url } from '@/utils/url';
/**
 * "/${$tenantIdenfitifer}`/{paths}" の tenantIdentifier までを除くパスを定義
 */

export const home = '/';

export const loginPage = (srcPageUrl: string) => ({
  pathname: `/login`,
  query: {
    src: srcPageUrl,
  },
});

export const signUpPage = (srcPageUrl: string) => ({
  pathname: `/signup`,
  query: {
    src: srcPageUrl,
  },
});

export const passwordResetPage = '/password_reset';

export const creditCardAddPage = '/credit_card_add';
export const deliveryAddressAddPage = (srcPageUrl: string): Url => ({
  pathname: `/delivery/address_add`,
  query: {
    src: srcPageUrl,
  },
});

export const shopListPage = '/shops';

export const couponAddPage = '/coupon_add';

export const couponPage = (cartId?: string, selectedCouponId?: string): Url => {
  const path = `/coupon`;
  if (!cartId) {
    return { pathname: path };
  }
  return {
    pathname: path,
    query: {
      cartId: cartId,
      selectedCouponId: selectedCouponId,
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

// NOTE: 開発環境のみでアクセス可能なページ
export const debugPage = '/debug/info';
