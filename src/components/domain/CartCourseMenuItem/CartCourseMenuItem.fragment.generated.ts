import gql from 'graphql-tag';
export type CartCourseMenuItemFragment = {
  __typename: 'OrderCourseMenuItem';
  id: string;
  quantity: number;
  totalPrice: number;
  courseMenu: {
    __typename: 'CourseMenu';
    id: string;
    name: string;
    category?: { __typename: 'CourseMenuCategory'; name: string } | null;
  };
  entry: { __typename: 'CourseMenuEntry'; id: string; name: string };
};

export const CartCourseMenuItemFragmentDoc = gql`
  fragment CartCourseMenuItem on OrderCourseMenuItem {
    id
    courseMenu {
      id
      category {
        name
      }
      name
    }
    entry {
      id
      name
    }
    quantity
    totalPrice
  }
`;
