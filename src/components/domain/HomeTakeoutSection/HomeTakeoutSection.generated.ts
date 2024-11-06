import gql from 'graphql-tag';
export type HomeTakeoutSectionPartsFragment = { __typename: 'TakeoutSection'; selectedScheduledTime: string };

export const HomeTakeoutSectionPartsFragmentDoc = gql`
  fragment HomeTakeoutSectionParts on TakeoutSection {
    selectedScheduledTime
  }
`;
