import gql from 'graphql-tag';
export type MyPageProfileHeaderFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; lastNameKana?: string | null } | null;
};

export const MyPageProfileHeaderFragmentDoc = gql`
  fragment MyPageProfileHeader on User {
    profile {
      lastNameKana
    }
  }
`;
