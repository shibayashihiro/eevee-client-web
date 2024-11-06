import gql from 'graphql-tag';

export type NavbarViewingPartsFragment = { __typename: 'Tenant'; logo: string };

export type NavbarViewerPartsFragment = {
  __typename: 'User';
  profile?: { __typename: 'Profile'; imageUrl: string } | null;
  loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
};

export const NavbarViewingPartsFragmentDoc = gql`
  fragment NavbarViewingParts on Tenant {
    logo
  }
`;
export const NavbarViewerPartsFragmentDoc = gql`
  fragment NavbarViewerParts on User {
    ...NavbarMenuViewer
  }
`;
