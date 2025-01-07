import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OrderPrivacyPolicyAgreementPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type OrderPrivacyPolicyAgreementPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; privacyPolicyUrl: string };
};

export const OrderPrivacyPolicyAgreementPageDocument = gql`
  query OrderPrivacyPolicyAgreementPage {
    viewing {
      privacyPolicyUrl
    }
  }
`;

export function useOrderPrivacyPolicyAgreementPageQuery(
  options?: Omit<Urql.UseQueryArgs<OrderPrivacyPolicyAgreementPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<OrderPrivacyPolicyAgreementPageQuery, OrderPrivacyPolicyAgreementPageQueryVariables>({
    query: OrderPrivacyPolicyAgreementPageDocument,
    ...options,
  });
}
