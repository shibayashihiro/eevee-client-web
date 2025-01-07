import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SuspendUserMutationVariables = Types.Exact<{
  input: Types.SuspendUserInput;
}>;

export type SuspendUserMutation = {
  __typename: 'Mutation';
  suspendUser: { __typename: 'SuspendUserPayload'; clientMutationId?: string | null };
};

export const SuspendUserDocument = gql`
  mutation SuspendUser($input: SuspendUserInput!) {
    suspendUser(input: $input) {
      clientMutationId
    }
  }
`;

export function useSuspendUserMutation() {
  return Urql.useMutation<SuspendUserMutation, SuspendUserMutationVariables>(SuspendUserDocument);
}
