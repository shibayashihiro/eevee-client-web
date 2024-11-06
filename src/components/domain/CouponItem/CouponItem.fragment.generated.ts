import gql from 'graphql-tag';
export type CouponItemPartsFragment = {
  __typename: 'Coupon';
  id: string;
  title: string;
  subTitle: string;
  details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
};

export const CouponItemPartsFragmentDoc = gql`
  fragment CouponItemParts on Coupon {
    id
    title
    subTitle
    details {
      name
      value
    }
  }
`;
