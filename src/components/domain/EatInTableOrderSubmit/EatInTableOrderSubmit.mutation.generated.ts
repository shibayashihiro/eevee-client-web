import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitEatInTableOrderMutationVariables = Types.Exact<{
  input: Types.SubmitTableOrderInput;
}>;

export type SubmitEatInTableOrderMutation = {
  __typename: 'Mutation';
  submitTableOrder: {
    __typename: 'SubmitTableOrderPayload';
    clientMutationId?: string | null;
    order:
      | { __typename: 'DeliveryOrder' }
      | { __typename: 'EatInOrder' }
      | { __typename: 'TableOrder' }
      | { __typename: 'TakeoutOrder' };
    postOrderMessage?: { __typename: 'PostOrderMessage'; title: string; message: string } | null;
  };
};

export const SubmitEatInTableOrderDocument = gql`
  mutation SubmitEatInTableOrder($input: SubmitTableOrderInput!) {
    submitTableOrder(input: $input) {
      clientMutationId
      order {
        __typename
      }
      postOrderMessage {
        title
        message
      }
    }
  }
`;

export function useSubmitEatInTableOrderMutation() {
  return Urql.useMutation<SubmitEatInTableOrderMutation, SubmitEatInTableOrderMutationVariables>(
    SubmitEatInTableOrderDocument,
  );
}
