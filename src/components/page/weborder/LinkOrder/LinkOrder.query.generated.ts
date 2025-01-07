import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LinkOrderPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type LinkOrderPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const LinkOrderPageDocument = gql`
  query LinkOrderPage {
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
  ${GeneralNavbarMenuViewerFragmentDoc}
`;

export function useLinkOrderPageQuery(options?: Omit<Urql.UseQueryArgs<LinkOrderPageQueryVariables>, 'query'>) {
  return Urql.useQuery<LinkOrderPageQuery, LinkOrderPageQueryVariables>({ query: LinkOrderPageDocument, ...options });
}
