import gql from 'graphql-tag';

export type GeneralNavbarMenuViewerFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; imageUrl: string } | null;
  loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
};

export type GeneralNavbarMenuFacilityFragment = {
  __typename: 'Facility';
  featureFlags: {
    __typename: 'FeatureFlags';
    showPriceExcludingTax: boolean;
    loyaltyProgramEnabled: boolean;
    itemCodeSearchEnabled: boolean;
    OnlinePaymentEnabled: boolean;
  };
};

export const GeneralNavbarMenuViewerFragmentDoc = gql`
  fragment GeneralNavbarMenuViewer on User {
    profile {
      imageUrl
    }
    loyaltyCard {
      __typename
    }
  }
`;
export const GeneralNavbarMenuFacilityFragmentDoc = gql`
  fragment GeneralNavbarMenuFacility on Facility {
    featureFlags {
      ...FeatureFlagsForProvider
    }
  }
`;
