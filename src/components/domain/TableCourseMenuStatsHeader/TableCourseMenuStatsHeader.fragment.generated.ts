import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../graphql/generated/types';

export type TableCourseMenuStatsHeaderFragment = {
  __typename: 'Table';
  mainCourseMenu?: {
    __typename: 'TableCourseMenu';
    lastOrderAt?: DateTime | null;
    noticeReadStatus: Types.NoticeReadStatus;
    courseMenu: {
      __typename: 'CourseMenu';
      name: string;
      ruleDescriptions: Array<string>;
      category?: { __typename: 'CourseMenuCategory'; name: string } | null;
    };
  } | null;
  subCourseMenus: Array<{ __typename: 'TableCourseMenu'; courseMenu: { __typename: 'CourseMenu'; name: string } }>;
};

export const TableCourseMenuStatsHeaderFragmentDoc = gql`
  fragment TableCourseMenuStatsHeader on Table {
    mainCourseMenu {
      lastOrderAt
      courseMenu {
        name
        ruleDescriptions
      }
      ...TableCourseMenuForTimer
    }
    subCourseMenus {
      courseMenu {
        name
      }
    }
  }
`;
