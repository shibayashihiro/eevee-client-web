import gql from 'graphql-tag';
export type HomeCourseMenuCategoriesSectionFragment = {
  __typename: 'CourseMenuCategoriesSection';
  categories: Array<{
    __typename: 'CourseMenuCategory';
    id: string;
    name: string;
    courses: Array<{
      __typename: 'CourseMenu';
      id: string;
      name: string;
      pricePerPerson?:
        | { __typename: 'CourseMenuFixedPricePerPerson'; price: number; priceExcludingTax: number }
        | { __typename: 'CourseMenuRangePricePerPerson'; minPrice: number; minPriceExcludingTax: number }
        | null;
    }>;
  }>;
};

export const HomeCourseMenuCategoriesSectionFragmentDoc = gql`
  fragment HomeCourseMenuCategoriesSection on CourseMenuCategoriesSection {
    categories {
      id
      name
      courses {
        id
        name
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
    }
  }
`;
