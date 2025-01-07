import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type PaymentItemPartsFragment = {
  __typename: 'Payment';
  name: string;
  brand: string;
  isSelected: boolean;
  paymentType: Types.PaymentType;
  isSignInRequired: boolean;
};

export const PaymentItemPartsFragmentDoc = gql`
  fragment PaymentItemParts on Payment {
    name
    brand
    isSelected
    paymentType
    isSignInRequired
  }
`;
