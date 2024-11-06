import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type UserSubscriptionForRouteGuardFragment = {
  __typename: 'UserSubscription';
  currentPlan: { __typename: 'UserSubscriptionPlan'; status: Types.UserSubscriptionStatus };
};

export const UserSubscriptionForRouteGuardFragmentDoc = gql`
  fragment UserSubscriptionForRouteGuard on UserSubscription {
    currentPlan {
      status
    }
  }
`;
