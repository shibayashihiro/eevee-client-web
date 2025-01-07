import gql from 'graphql-tag';
export type HomeContainerPromotionEnabledSectionFragment = {
  __typename: 'Tenant';
  id: string;
  topPageBannerSections?: {
    __typename: 'TopPageBannerSections';
    bannerSection: {
      __typename: 'BannerSection';
      banners: Array<{ __typename: 'Banner'; image: string; url?: string | null; title: string }>;
    };
    navigationItemsSection: {
      __typename: 'BannerSection';
      banners: Array<{ __typename: 'Banner'; image: string; url?: string | null; title: string }>;
    };
  } | null;
};

export const HomeContainerPromotionEnabledSectionFragmentDoc = gql`
  fragment HomeContainerPromotionEnabledSection on Tenant {
    id
    topPageBannerSections {
      bannerSection {
        banners {
          image
          url
          title
        }
      }
      navigationItemsSection {
        banners {
          image
          url
          title
        }
      }
    }
  }
`;
