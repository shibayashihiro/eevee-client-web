import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAppPromotionsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAppPromotionsQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    iosDownloadUrl: string;
    androidDownloadUrl: string;
    accountRegistrationIncentives: Array<{
      __typename: 'AccountRegistrationIncentive';
      incentive: string;
      title: string;
      name: string;
    }>;
    appPromotion?: {
      __typename: 'Promotion';
      title: string;
      items: Array<{ __typename: 'PromotionItem'; title: string; description: string; icon: string }>;
    } | null;
  };
};

export const GetAppPromotionsDocument = gql`
  query GetAppPromotions {
    tenant: viewing {
      accountRegistrationIncentives {
        incentive
        title
        name
      }
      iosDownloadUrl
      androidDownloadUrl
      appPromotion {
        title
        items {
          title
          description
          icon
        }
      }
    }
  }
`;

export function useGetAppPromotionsQuery(options?: Omit<Urql.UseQueryArgs<GetAppPromotionsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAppPromotionsQuery, GetAppPromotionsQueryVariables>({
    query: GetAppPromotionsDocument,
    ...options,
  });
}
