import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UnsubscribeMutationVariables = Types.Exact<{
  input: Types.UnsubscribeInput;
}>;

export type UnsubscribeMutation = {
  __typename: 'Mutation';
  unsubscribe: {
    __typename: 'UnsubscribePayload';
    clientMutationId?: string | null;
    subscription: { __typename: 'UserSubscription' };
  };
};

export type CancelUnsubscribeMutationVariables = Types.Exact<{
  input: Types.CancelUnsubscribeInput;
}>;

export type CancelUnsubscribeMutation = {
  __typename: 'Mutation';
  cancelUnsubscribe: {
    __typename: 'CancelUnsubscribePayload';
    clientMutationId?: string | null;
    subscription: { __typename: 'UserSubscription' };
  };
};

export const UnsubscribeDocument = gql`
  mutation Unsubscribe($input: UnsubscribeInput!) {
    unsubscribe(input: $input) {
      clientMutationId
      subscription {
        __typename
      }
    }
  }
`;

export function useUnsubscribeMutation() {
  return Urql.useMutation<UnsubscribeMutation, UnsubscribeMutationVariables>(UnsubscribeDocument);
}
export const CancelUnsubscribeDocument = gql`
  mutation CancelUnsubscribe($input: CancelUnsubscribeInput!) {
    cancelUnsubscribe(input: $input) {
      clientMutationId
      subscription {
        __typename
      }
    }
  }
`;

export function useCancelUnsubscribeMutation() {
  return Urql.useMutation<CancelUnsubscribeMutation, CancelUnsubscribeMutationVariables>(CancelUnsubscribeDocument);
}
