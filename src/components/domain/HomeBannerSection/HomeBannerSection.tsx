import { Box, HStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';

import { Banner } from './Banner';
import { HomeBannerSectionPartsFragment } from './HomeBannerSection.fragment.generated';

type Props = {
  bannerSection: HomeBannerSectionPartsFragment;
};

export const HomeBannerSection = ({ bannerSection }: Props) => {
  const { banners } = bannerSection;
  return (
    <HStack spacing={4} px={containerMarginX} overflowX="scroll">
      {banners.map((banner, index) => (
        <Box key={index}>
          <Banner banner={banner} />
        </Box>
      ))}
    </HStack>
  );
};
