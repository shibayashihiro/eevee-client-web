import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateUsingDeliveryAddressMutationVariables = Types.Exact<{
  input: Types.UpdateUsingDeliveryAddressInput;
}>;

export type UpdateUsingDeliveryAddressMutation = {
  __typename: 'Mutation';
  updateUsingDeliveryAddress: {
    __typename: 'UpdateUsingDeliveryAddressPayload';
    deliveryAddress: { __typename: 'DeliveryAddress' };
  };
};

export type RemoveDeliveryAddressMutationVariables = Types.Exact<{
  input: Types.RemoveDeliveryAddressInput;
}>;

export type RemoveDeliveryAddressMutation = {
  __typename: 'Mutation';
  removeDeliveryAddress: {
    __typename: 'RemoveDeliveryAddressPayload';
    deliveryAddress: { __typename: 'DeliveryAddress' };
  };
};

export const UpdateUsingDeliveryAddressDocument = gql`
  mutation updateUsingDeliveryAddress($input: UpdateUsingDeliveryAddressInput!) {
    updateUsingDeliveryAddress(input: $input) {
      deliveryAddress {
        __typename
      }
    }
  }
`;

export function useUpdateUsingDeliveryAddressMutation() {
  return Urql.useMutation<UpdateUsingDeliveryAddressMutation, UpdateUsingDeliveryAddressMutationVariables>(
    UpdateUsingDeliveryAddressDocument,
  );
}
export const RemoveDeliveryAddressDocument = gql`
  mutation removeDeliveryAddress($input: RemoveDeliveryAddressInput!) {
    removeDeliveryAddress(input: $input) {
      deliveryAddress {
        __typename
      }
    }
  }
`;

export function useRemoveDeliveryAddressMutation() {
  return Urql.useMutation<RemoveDeliveryAddressMutation, RemoveDeliveryAddressMutationVariables>(
    RemoveDeliveryAddressDocument,
  );
}
