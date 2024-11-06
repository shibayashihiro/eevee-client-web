import gql from 'graphql-tag';
export type CourseMenuEntryForInputPeopleCountListItemFragment = {
  __typename: 'CourseMenuEntry';
  id: string;
  name: string;
  price: number;
  priceExcludingTax: number;
};

export const CourseMenuEntryForInputPeopleCountListItemFragmentDoc = gql`
  fragment CourseMenuEntryForInputPeopleCountListItem on CourseMenuEntry {
    id
    name
    price
    priceExcludingTax
  }
`;
