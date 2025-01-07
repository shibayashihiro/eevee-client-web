import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitUserProfileFormMutationVariables = Types.Exact<{
  input: Types.UpdateProfileInput;
}>;

export type SubmitUserProfileFormMutation = {
  __typename: 'Mutation';
  updateProfile: {
    __typename: 'UpdateProfilePayload';
    clientMutationId?: string | null;
    profile: { __typename: 'Profile' };
  };
};

export const SubmitUserProfileFormDocument = gql`
  mutation SubmitUserProfileForm($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      clientMutationId
      profile {
        __typename
      }
    }
  }
`;

export function useSubmitUserProfileFormMutation() {
  return Urql.useMutation<SubmitUserProfileFormMutation, SubmitUserProfileFormMutationVariables>(
    SubmitUserProfileFormDocument,
  );
}
