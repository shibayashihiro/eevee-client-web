import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

export type HomeLastOrderPassedBannerFragment = {
  __typename: 'TableCourseMenu';
  lastOrderAt?: DateTime | null;
  courseMenu: { __typename: 'CourseMenu'; name: string };
};

export const HomeLastOrderPassedBannerFragmentDoc = gql`
  fragment HomeLastOrderPassedBanner on TableCourseMenu {
    lastOrderAt
    courseMenu {
      name
    }
  }
`;
