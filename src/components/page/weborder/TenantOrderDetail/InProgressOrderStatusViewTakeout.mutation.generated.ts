import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ReceiveTakeoutOrderFromTenantOrderDetailMutationVariables = Types.Exact<{
  input: Types.ReceiveOrderInput;
}>;

export type ReceiveTakeoutOrderFromTenantOrderDetailMutation = {
  __typename: 'Mutation';
  receiveOrder: {
    __typename: 'ReceiveOrderPayload';
    order:
      | { __typename: 'DeliveryOrder' }
      | { __typename: 'EatInOrder' }
      | { __typename: 'TableOrder' }
      | { __typename: 'TakeoutOrder' };
  };
};

export const ReceiveTakeoutOrderFromTenantOrderDetailDocument = gql`
  mutation ReceiveTakeoutOrderFromTenantOrderDetail($input: ReceiveOrderInput!) {
    receiveOrder(input: $input) {
      order {
        __typename
      }
    }
  }
`;

export function useReceiveTakeoutOrderFromTenantOrderDetailMutation() {
  return Urql.useMutation<
    ReceiveTakeoutOrderFromTenantOrderDetailMutation,
    ReceiveTakeoutOrderFromTenantOrderDetailMutationVariables
  >(ReceiveTakeoutOrderFromTenantOrderDetailDocument);
}
