import gql from 'graphql-tag';

export type CourseMenuEntriesInputFragment = {
  __typename: 'CourseMenu';
  id: string;
  minSelectCount: number;
  entries: Array<{ __typename: 'CourseMenuEntry'; id: string; name: string; price: number; priceExcludingTax: number }>;
};

export const CourseMenuEntriesInputFragmentDoc = gql`
  fragment CourseMenuEntriesInput on CourseMenu {
    id
    minSelectCount
    entries {
      ...CourseMenuEntryForInputPeopleCountListItem
    }
  }
`;
