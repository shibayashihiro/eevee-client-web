import gql from 'graphql-tag';

export type NavbarViewingPartsFragment = { __typename: 'Tenant'; logo: string };

export type NavbarViewerPartsFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; imageUrl: string } | null;
  loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
};

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
    OnlinePaymentEnabled: boolean;
  };
};

export const NavbarViewingPartsFragmentDoc = gql`
  fragment NavbarViewingParts on Tenant {
    logo
  }
`;
export const NavbarMenuViewerFragmentDoc = gql`
  fragment NavbarMenuViewer on User {
    ...GeneralNavbarMenuViewer
  }
`;
export const NavbarViewerPartsFragmentDoc = gql`
  fragment NavbarViewerParts on User {
    ...NavbarMenuViewer
  }
`;
export const NavbarMenuFacilityFragmentDoc = gql`
  fragment NavbarMenuFacility on Facility {
    ...GeneralNavbarMenuFacility
  }
`;
