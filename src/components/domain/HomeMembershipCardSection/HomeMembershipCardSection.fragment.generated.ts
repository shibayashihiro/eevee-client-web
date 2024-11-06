import gql from 'graphql-tag';
export type HomeMembershipCardSectionPartsFragment = {
  __typename: 'MembershipCardSection';
  logo: string;
  membershipQRCodeData: string;
};

export const HomeMembershipCardSectionPartsFragmentDoc = gql`
  fragment HomeMembershipCardSectionParts on MembershipCardSection {
    logo
    membershipQRCodeData
  }
`;
