import gql from 'graphql-tag';

import * as Types from '../../graphql/generated/types';

export type PaymentIntentForConfirmCardPaymentFragment = {
  __typename: 'PaymentIntent';
  clientSecret?: string | null;
  status: Types.PaymentIntentStatus;
};

export const PaymentIntentForConfirmCardPaymentFragmentDoc = gql`
  fragment PaymentIntentForConfirmCardPayment on PaymentIntent {
    clientSecret
    status
  }
`;
