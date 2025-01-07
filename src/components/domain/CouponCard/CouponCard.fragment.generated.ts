import gql from 'graphql-tag';
export type CouponCardForListFragment = {
  __typename: 'Coupon';
  id: string;
  title: string;
  subTitle: string;
  statusLabel: string;
  image: string;
  canManualUse: boolean;
  details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
};

export const CouponCardForListFragmentDoc = gql`
  fragment CouponCardForList on Coupon {
    id
    title
    subTitle
    statusLabel
    image
    details {
      name
      value
    }
    canManualUse
  }
`;
