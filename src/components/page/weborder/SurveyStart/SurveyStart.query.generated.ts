import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { NavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/NavbarMenu.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SurveyStartQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SurveyStartQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const SurveyStartDocument = gql`
  query SurveyStart {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      ...NavbarViewerParts
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
`;

export function useSurveyStartQuery(options?: Omit<Urql.UseQueryArgs<SurveyStartQueryVariables>, 'query'>) {
  return Urql.useQuery<SurveyStartQuery, SurveyStartQueryVariables>({ query: SurveyStartDocument, ...options });
}
