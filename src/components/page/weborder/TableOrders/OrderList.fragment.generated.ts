import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

export type TableOrdersPageOrderListPartsFragment = {
  __typename: 'Table';
  orders: Array<{
    __typename: 'TableOrder';
    id: string;
    submittedAt?: DateTime | null;
    progress?: { __typename: 'Progress'; prepared: boolean } | null;
    items: Array<{
      __typename: 'OrderItem';
      id: string;
      name: string;
      totalPrice: number;
      quantity: number;
      menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
      selectedOptionItems: Array<{
        __typename: 'OrderOptionItem';
        name: string;
        quantity: number;
        subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
      }>;
    }>;
  }>;
  mainCourseMenu?: {
    __typename: 'TableCourseMenu';
    courseMenu: { __typename: 'CourseMenu'; id: string; name: string };
    courseMenuItems: Array<{
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
    }>;
  } | null;
  subCourseMenus: Array<{
    __typename: 'TableCourseMenu';
    courseMenu: { __typename: 'CourseMenu'; id: string; name: string };
    courseMenuItems: Array<{
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
    }>;
  }>;
};

export type TableOrdersPageOrderListItemPartsFragment = {
  __typename: 'TableOrder';
  id: string;
  submittedAt?: DateTime | null;
  progress?: { __typename: 'Progress'; prepared: boolean } | null;
  items: Array<{
    __typename: 'OrderItem';
    id: string;
    name: string;
    totalPrice: number;
    quantity: number;
    menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
};

export type CourseMenuPartsFragment = {
  __typename: 'TableCourseMenu';
  courseMenu: { __typename: 'CourseMenu'; id: string; name: string };
  courseMenuItems: Array<{
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
  }>;
};

export const TableOrdersPageOrderListItemPartsFragmentDoc = gql`
  fragment TableOrdersPageOrderListItemParts on TableOrder {
    id
    submittedAt
    progress {
      prepared
    }
    items {
      ...CartMenuItem
    }
  }
`;
export const CourseMenuPartsFragmentDoc = gql`
  fragment CourseMenuParts on TableCourseMenu {
    courseMenu {
      id
      name
    }
    courseMenuItems {
      ...CartCourseMenuItem
    }
  }
`;
export const TableOrdersPageOrderListPartsFragmentDoc = gql`
  fragment TableOrdersPageOrderListParts on Table {
    orders {
      ...TableOrdersPageOrderListItemParts
    }
    mainCourseMenu {
      ...CourseMenuParts
    }
    subCourseMenus {
      ...CourseMenuParts
    }
  }
`;
