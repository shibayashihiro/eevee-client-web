import gql from 'graphql-tag';
export type OwnerCommentPartsFragment = {
  __typename: 'OwnerComment';
  comment: string;
  owner: { __typename: 'Owner'; name?: string | null; icon: string };
};

export const OwnerCommentPartsFragmentDoc = gql`
  fragment OwnerCommentParts on OwnerComment {
    owner {
      name
      icon
    }
    comment
  }
`;
