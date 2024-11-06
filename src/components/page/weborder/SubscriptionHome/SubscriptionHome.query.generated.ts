import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSubscriptionHomeQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSubscriptionHomeQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    subscription?: {
      __typename: 'UserSubscription';
      currentPlan: { __typename: 'UserSubscriptionPlan'; status: Types.UserSubscriptionStatus };
    } | null;
  };
};

export const GetSubscriptionHomeDocument = gql`
  query GetSubscriptionHome {
    viewer {
      subscription {
        currentPlan {
          status
        }
      }
    }
  }
`;

export function useGetSubscriptionHomeQuery(
  options?: Omit<Urql.UseQueryArgs<GetSubscriptionHomeQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetSubscriptionHomeQuery, GetSubscriptionHomeQueryVariables>({
    query: GetSubscriptionHomeDocument,
    ...options,
  });
}
