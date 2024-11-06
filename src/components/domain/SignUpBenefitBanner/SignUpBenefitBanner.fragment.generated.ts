import gql from 'graphql-tag';
export type SignUpBenefitBannerPartsFragment = { __typename: 'AccountRegistrationIncentive'; title: string };

export const SignUpBenefitBannerPartsFragmentDoc = gql`
  fragment SignUpBenefitBannerParts on AccountRegistrationIncentive {
    title
  }
`;
