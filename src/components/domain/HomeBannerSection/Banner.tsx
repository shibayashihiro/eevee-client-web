import { VStack, Text, Box, HStack, LinkBox, LinkOverlay } from '@chakra-ui/react';

import { MemoIcon } from '@/components/ui/Icons/MemoIcon';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { BannerInteractionBehavior } from '@/graphql/generated/types';
import { tableOrdersPage } from '@/utils/paths/facilityPages';
import { NextLink } from '@/components/ui/NextLink';

import { HomeBannerPartsFragment } from './Banner.fragment.generated';

type Props = {
  banner: HomeBannerPartsFragment;
};

export const Banner = ({ banner }: Props) => {
  const interactions = useBannerInteractions();
  return (
    <LinkBox>
      <VStack align="stretch" w="163px" spacing={0}>
        <MessageBox message={banner.message} />
        <LinkOverlay as={NextLink} href={interactions[banner.behavior].linkTo}>
          <TitleBox title={banner.title} />
        </LinkOverlay>
      </VStack>
    </LinkBox>
  );
};

// NOTE: 現状はバナークリックで画面遷移のみ
type BannerInteraction = {
  linkTo: string;
};

// （もしテストを書く場合に）テストしやすいようにhooksに切り出している
const useBannerInteractions = (): Record<BannerInteractionBehavior, BannerInteraction> => {
  const facilityId = useFacilityId();
  return {
    [BannerInteractionBehavior.ShowOrderHistory]: {
      linkTo: tableOrdersPage(facilityId),
    },
  };
};

const MessageBox = ({ message }: { message: string }) => {
  return (
    <Box px="12px" pt="15px" pb="13px" bgColor="brand.backgroundSoft" borderRadius="12px 12px 0px 0px">
      <Text fontSize="xs" fontWeight="semibold" color="brand.primaryText">
        {message}
      </Text>
    </Box>
  );
};

const TitleBox = ({ title }: { title: string }) => {
  return (
    <HStack spacing="4px" px="12px" py="8px" bgColor="brand.primary" borderRadius="0px 0px 12px 12px">
      <MemoIcon color="white" />
      <Text fontSize="sm" fontWeight="semibold" color="white">
        {title}
      </Text>
    </HStack>
  );
};
