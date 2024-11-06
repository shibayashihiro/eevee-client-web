import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type HomeBannerSectionPartsFragment = {
  __typename: 'BannerSection';
  banners: Array<{ __typename: 'Banner'; title: string; message: string; behavior: Types.BannerInteractionBehavior }>;
};

export const HomeBannerSectionPartsFragmentDoc = gql`
  fragment HomeBannerSectionParts on BannerSection {
    banners {
      ...HomeBannerParts
    }
  }
`;
