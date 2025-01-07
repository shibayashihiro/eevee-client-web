import gql from 'graphql-tag';
export type MyPageMembershipCardFragment = {
  __typename: 'User';
  membershipCard: { __typename: 'MembershipCard'; membershipQRCodeData: string };
};

export const MyPageMembershipCardFragmentDoc = gql`
  fragment MyPageMembershipCard on User {
    membershipCard(facilityID: $facilityID) {
      membershipQRCodeData
    }
  }
`;
