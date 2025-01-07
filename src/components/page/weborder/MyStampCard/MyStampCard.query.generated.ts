import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { StampCardPartsFragmentDoc } from '../../../domain/StampCard/StampCard.fragment.generated';
import {
  GeneralNavbarMenuViewerFragmentDoc,
  GeneralNavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

import { StampCardsCarouselFragmentDoc } from './StampCardsCarousel.fragment.generated';
import { LoyaltyCardSystemFragmentDoc } from './LoyaltyCardSystem.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMyStampCardPageQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
}>;

export type GetMyStampCardPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    loyaltyCard?: {
      __typename: 'UserLoyaltyCard';
      loyaltyCard: {
        __typename: 'LoyaltyCard';
        name: string;
        hasRankUp: boolean;
        cautions: Array<string>;
        pointCondition: { __typename: 'LoyaltyCardPointCondition'; condition: string; caution?: string | null };
        ranks: Array<{
          __typename: 'LoyaltyCardRank';
          name: string;
          colorRGB: string;
          rankUpCondition: string;
          benefit?: string | null;
          stampCardRewards: Array<string>;
        }>;
      };
      currentRank: { __typename: 'LoyaltyCardRank'; name: string; colorRGB: string };
      nextRank?: { __typename: 'LoyaltyCardRank'; name: string } | null;
      activeStampCards: Array<{
        __typename: 'StampCard';
        reward: string;
        currentPoints: number;
        maxPointPerPage: number;
      }>;
      expiration: { __typename: 'UserLoyaltyCardExpiration'; description?: string | null; expiredAt?: DateTime | null };
    } | null;
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
  };
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
        featureFlags: {
          __typename: 'FeatureFlags';
          showPriceExcludingTax: boolean;
          loyaltyProgramEnabled: boolean;
          itemCodeSearchEnabled: boolean;
          OnlinePaymentEnabled: boolean;
        };
      }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
};

export const GetMyStampCardPageDocument = gql`
  query GetMyStampCardPage($facilityId: ID!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      loyaltyCard {
        loyaltyCard {
          name
        }
        currentRank {
          name
          colorRGB
        }
        nextRank {
          name
        }
        ...StampCardsCarousel
        ...LoyaltyCardSystem
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityId) {
      ...NavbarMenuFacility
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${StampCardsCarouselFragmentDoc}
  ${StampCardPartsFragmentDoc}
  ${LoyaltyCardSystemFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetMyStampCardPageQuery(
  options: Omit<Urql.UseQueryArgs<GetMyStampCardPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMyStampCardPageQuery, GetMyStampCardPageQueryVariables>({
    query: GetMyStampCardPageDocument,
    ...options,
  });
}
