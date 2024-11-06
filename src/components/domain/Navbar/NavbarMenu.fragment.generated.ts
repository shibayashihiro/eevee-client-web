import gql from 'graphql-tag';

export type NavbarMenuViewerFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; imageUrl: string } | null;
  loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
};

export type NavbarMenuFacilityFragment = {
  __typename: 'Facility';
  featureFlags: {
    __typename: 'FeatureFlags';
    showPriceExcludingTax: boolean;
    loyaltyProgramEnabled: boolean;
    itemCodeSearchEnabled: boolean;
  };
};

export const NavbarMenuViewerFragmentDoc = gql`
  fragment NavbarMenuViewer on User {
    profile {
      imageUrl
    }
    loyaltyCard {
      __typename
    }
  }
`;
export const NavbarMenuFacilityFragmentDoc = gql`
  fragment NavbarMenuFacility on Facility {
    featureFlags {
      ...FeatureFlagsForProvider
    }
  }
`;
