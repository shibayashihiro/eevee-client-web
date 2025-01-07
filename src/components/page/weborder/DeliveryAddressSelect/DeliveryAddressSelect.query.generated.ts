import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { HomeHeaderFragmentDoc } from '../../../domain/HomeHeader/HomeHeader.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetDeliveryAddressSelectQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetDeliveryAddressSelectQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; idProviderName: string; logo: string };
  viewer: {
    __typename: 'User';
    deliveryAddresses: Array<{
      __typename: 'DeliveryAddress';
      id: string;
      prefecture: string;
      addressLine: string;
      buildingName: string;
      memo?: string | null;
      isUsing: boolean;
    }>;
    profile?: { __typename: 'Profile'; lastNameKana?: string | null; imageUrl: string } | null;
    coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const GetDeliveryAddressSelectDocument = gql`
  query GetDeliveryAddressSelect {
    viewing {
      ...NavbarViewingParts
      idProviderName
    }
    viewer {
      ...NavbarViewerParts
      ...HomeHeader
      deliveryAddresses {
        id
        prefecture
        addressLine
        buildingName
        memo
        isUsing
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${HomeHeaderFragmentDoc}
`;

export function useGetDeliveryAddressSelectQuery(
  options?: Omit<Urql.UseQueryArgs<GetDeliveryAddressSelectQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetDeliveryAddressSelectQuery, GetDeliveryAddressSelectQueryVariables>({
    query: GetDeliveryAddressSelectDocument,
    ...options,
  });
}
