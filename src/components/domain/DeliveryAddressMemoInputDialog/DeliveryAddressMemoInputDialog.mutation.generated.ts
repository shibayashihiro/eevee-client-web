import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateDeliveryAddressMemoMutationVariables = Types.Exact<{
  input: Types.UpdateDeliveryAddressMemoInput;
}>;

export type UpdateDeliveryAddressMemoMutation = {
  __typename: 'Mutation';
  updateDeliveryAddressMemo: {
    __typename: 'UpdateDeliveryAddressMemoPayload';
    deliveryAddress: { __typename: 'DeliveryAddress' };
  };
};

export const UpdateDeliveryAddressMemoDocument = gql`
  mutation UpdateDeliveryAddressMemo($input: UpdateDeliveryAddressMemoInput!) {
    updateDeliveryAddressMemo(input: $input) {
      deliveryAddress {
        __typename
      }
    }
  }
`;

export function useUpdateDeliveryAddressMemoMutation() {
  return Urql.useMutation<UpdateDeliveryAddressMemoMutation, UpdateDeliveryAddressMemoMutationVariables>(
    UpdateDeliveryAddressMemoDocument,
  );
}
