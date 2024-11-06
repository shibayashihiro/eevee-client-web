import gql from 'graphql-tag';
export type CourseMenuAsMenuItemDetail_CourseMenuInfoFragment = {
  __typename: 'CourseMenu';
  name: string;
  description?: string | null;
};

export const CourseMenuAsMenuItemDetail_CourseMenuInfoFragmentDoc = gql`
  fragment CourseMenuAsMenuItemDetail_CourseMenuInfo on CourseMenu {
    name
    description
  }
`;
