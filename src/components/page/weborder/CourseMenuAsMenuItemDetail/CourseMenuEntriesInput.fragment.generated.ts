import gql from 'graphql-tag';
export type CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragment = {
  __typename: 'CourseMenu';
  id: string;
  minSelectCount: number;
  entries: Array<{ __typename: 'CourseMenuEntry'; id: string; name: string; price: number; priceExcludingTax: number }>;
};

export const CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragmentDoc = gql`
  fragment CourseMenuAsMenuItemDetail_CourseMenuEntriesInput on CourseMenu {
    id
    minSelectCount
    entries {
      id
      name
      price
      priceExcludingTax
    }
  }
`;
