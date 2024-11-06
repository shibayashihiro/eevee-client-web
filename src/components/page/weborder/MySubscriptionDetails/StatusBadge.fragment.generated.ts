import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';

export type UserSubscriptionStatusBadgeFragment = {
  __typename: 'UserSubscriptionPlan';
  status: Types.UserSubscriptionStatus;
  expiresAt: DateTime;
};

export const UserSubscriptionStatusBadgeFragmentDoc = gql`
  fragment UserSubscriptionStatusBadge on UserSubscriptionPlan {
    status
    expiresAt
  }
`;
