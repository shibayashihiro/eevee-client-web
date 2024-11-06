import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type PaymentItemPartsFragment = {
  __typename: 'Payment';
  last4: string;
  brand: string;
  isSelected: boolean;
  paymentType: Types.PaymentType;
};

export const PaymentItemPartsFragmentDoc = gql`
  fragment PaymentItemParts on Payment {
    last4
    brand
    isSelected
    paymentType
  }
`;
