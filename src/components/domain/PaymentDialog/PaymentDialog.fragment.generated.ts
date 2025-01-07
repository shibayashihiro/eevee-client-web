import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type PaymentDialogPartsFragment = {
  __typename: 'Payment';
  id: string;
  paymentType: Types.PaymentType;
  name: string;
  brand: string;
  isSelected: boolean;
  isSignInRequired: boolean;
};

export const PaymentDialogPartsFragmentDoc = gql`
  fragment PaymentDialogParts on Payment {
    id
    paymentType
    ...PaymentItemParts
  }
`;
