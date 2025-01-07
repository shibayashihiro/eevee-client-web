import gql from 'graphql-tag';
export type HomeHeaderFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; lastNameKana?: string | null; imageUrl: string } | null;
  coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
};

export const HomeHeaderFragmentDoc = gql`
  fragment HomeHeader on User {
    profile {
      lastNameKana
      imageUrl
    }
    coupons(isAvailable: true) {
      nodes {
        id
      }
    }
  }
`;
