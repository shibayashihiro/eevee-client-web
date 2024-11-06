import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type HomeBannerPartsFragment = {
  __typename: 'Banner';
  title: string;
  message: string;
  behavior: Types.BannerInteractionBehavior;
};

export const HomeBannerPartsFragmentDoc = gql`
  fragment HomeBannerParts on Banner {
    title
    message
    behavior
  }
`;
