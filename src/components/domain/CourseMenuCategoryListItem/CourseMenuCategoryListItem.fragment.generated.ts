import gql from 'graphql-tag';
export type CourseMenuCategoryListItemFragment = {
  __typename: 'CourseMenuCategory';
  id: string;
  name: string;
  description?: string | null;
  courses: Array<{
    __typename: 'CourseMenu';
    id: string;
    name: string;
    description?: string | null;
    ruleDescriptions: Array<string>;
    pricePerPerson?:
      | { __typename: 'CourseMenuFixedPricePerPerson'; price: number; priceExcludingTax: number }
      | { __typename: 'CourseMenuRangePricePerPerson'; minPrice: number; minPriceExcludingTax: number }
      | null;
  }>;
};

export type CourseMenuListItemFragment = {
  __typename: 'CourseMenu';
  id: string;
  name: string;
  description?: string | null;
  ruleDescriptions: Array<string>;
  pricePerPerson?:
    | { __typename: 'CourseMenuFixedPricePerPerson'; price: number; priceExcludingTax: number }
    | { __typename: 'CourseMenuRangePricePerPerson'; minPrice: number; minPriceExcludingTax: number }
    | null;
};

export const CourseMenuListItemFragmentDoc = gql`
  fragment CourseMenuListItem on CourseMenu {
    id
    name
    description
    ruleDescriptions
    pricePerPerson {
      ... on CourseMenuFixedPricePerPerson {
        price
        priceExcludingTax
      }
      ... on CourseMenuRangePricePerPerson {
        minPrice
        minPriceExcludingTax
      }
    }
  }
`;
export const CourseMenuCategoryListItemFragmentDoc = gql`
  fragment CourseMenuCategoryListItem on CourseMenuCategory {
    id
    name
    description
    courses {
      ...CourseMenuListItem
    }
  }
`;
