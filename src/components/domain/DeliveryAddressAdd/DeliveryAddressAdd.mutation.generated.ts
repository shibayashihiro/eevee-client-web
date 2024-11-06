import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddDeliveryAddressMutationVariables = Types.Exact<{
  input: Types.AddDeliveryAddressInput;
}>;

export type AddDeliveryAddressMutation = {
  __typename: 'Mutation';
  addDeliveryAddress: {
    __typename: 'AddDeliveryAddressPayload';
    clientMutationId?: string | null;
    deliveryAddress: { __typename: 'DeliveryAddress' };
  };
};

export const AddDeliveryAddressDocument = gql`
  mutation AddDeliveryAddress($input: AddDeliveryAddressInput!) {
    addDeliveryAddress(input: $input) {
      clientMutationId
      deliveryAddress {
        __typename
      }
    }
  }
`;

export function useAddDeliveryAddressMutation() {
  return Urql.useMutation<AddDeliveryAddressMutation, AddDeliveryAddressMutationVariables>(AddDeliveryAddressDocument);
}
