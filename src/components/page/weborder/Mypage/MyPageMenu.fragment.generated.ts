import gql from 'graphql-tag';
export type TenantForMyPageMenuFragment = {
  __typename: 'Tenant';
  helpUrl: string;
  contactUrl: string;
  termsOfUseUrl: string;
  privacyPolicyUrl: string;
  specifiedCommercialTransactionActUrl: string;
};

export type UserForMyPageMenuFragment = {
  __typename: 'User';
  coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
};

export const TenantForMyPageMenuFragmentDoc = gql`
  fragment TenantForMyPageMenu on Tenant {
    helpUrl
    contactUrl
    termsOfUseUrl
    privacyPolicyUrl
    specifiedCommercialTransactionActUrl
  }
`;
export const UserForMyPageMenuFragmentDoc = gql`
  fragment UserForMyPageMenu on User {
    coupons(first: 100, isAvailable: true) {
      nodes {
        id
      }
    }
  }
`;
