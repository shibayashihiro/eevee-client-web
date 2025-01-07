import gql from 'graphql-tag';
import * as Urql from 'urql';

export const UpdateProfileMutation = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      clientMutationId
    }
  }
`;

export function useUpdateProfileMutation() {
  return Urql.useMutation(UpdateProfileMutation);
}
