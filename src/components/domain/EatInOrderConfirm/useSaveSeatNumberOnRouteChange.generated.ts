import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitSeatNumberMutationVariables = Types.Exact<{
  input: Types.SetSeatNumberInput;
}>;

export type SubmitSeatNumberMutation = {
  __typename: 'Mutation';
  setSeatNumber: { __typename: 'SetSeatNumberPayload'; clientMutationId?: string | null };
};

export const SubmitSeatNumberDocument = gql`
  mutation SubmitSeatNumber($input: SetSeatNumberInput!) {
    setSeatNumber(input: $input) {
      clientMutationId
    }
  }
`;

export function useSubmitSeatNumberMutation() {
  return Urql.useMutation<SubmitSeatNumberMutation, SubmitSeatNumberMutationVariables>(SubmitSeatNumberDocument);
}
