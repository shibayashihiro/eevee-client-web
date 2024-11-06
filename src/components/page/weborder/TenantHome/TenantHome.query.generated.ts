import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { NavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/NavbarMenu.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetWebHomeSectionsForTenantPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetWebHomeSectionsForTenantPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    helpUrl: string;
    termsOfUseUrl: string;
    specifiedCommercialTransactionActUrl: string;
    mainVisualImage: string;
    companyName: string;
    logo: string;
  };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const GetWebHomeSectionsForTenantPageDocument = gql`
  query GetWebHomeSectionsForTenantPage {
    viewing {
      helpUrl
      termsOfUseUrl
      specifiedCommercialTransactionActUrl
      mainVisualImage
      companyName
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

export function useGetWebHomeSectionsForTenantPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetWebHomeSectionsForTenantPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetWebHomeSectionsForTenantPageQuery, GetWebHomeSectionsForTenantPageQueryVariables>({
    query: GetWebHomeSectionsForTenantPageDocument,
    ...options,
  });
}
