import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../graphql/generated/types';

export type TableCourseMenuForTimerFragment = {
  __typename: 'TableCourseMenu';
  lastOrderAt?: DateTime | null;
  noticeReadStatus: Types.NoticeReadStatus;
  courseMenu: { __typename: 'CourseMenu'; category?: { __typename: 'CourseMenuCategory'; name: string } | null };
};

export const TableCourseMenuForTimerFragmentDoc = gql`
  fragment TableCourseMenuForTimer on TableCourseMenu {
    lastOrderAt
    noticeReadStatus
    courseMenu {
      category {
        name
      }
    }
  }
`;
