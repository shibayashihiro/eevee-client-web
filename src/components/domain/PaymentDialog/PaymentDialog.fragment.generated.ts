import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type PaymentDialogPartsFragment = {
  __typename: 'Payment';
  id: string;
  last4: string;
  brand: string;
  isSelected: boolean;
  paymentType: Types.PaymentType;
};

export const PaymentDialogPartsFragmentDoc = gql`
  fragment PaymentDialogParts on Payment {
    id
    last4
    brand
    isSelected
    paymentType
  }
`;
