import { Box, Center, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import liff from '@line/liff';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { NoData } from '@/components/ui/NoData';
import { CouponIcon } from '@/components/ui/Icons/CouponIcon';
import { containerMarginX } from '@/utils/constants';
import { LoyaltyCardRankMark } from '@/components/ui/LoyaltyCardRankMark';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { isFacility } from '@/graphql/helper';

import { GetMyStampCardPageQuery, useGetMyStampCardPageQuery } from './MyStampCard.query.generated';
import { HeaderWithBackground } from './HeaderWithBackground';
import { LoyaltyCardSystem } from './LoyaltyCardSystem';
import { StampCardsCarousel } from './StampCardsCarousel';

export const MyStampCardPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  const [{ data, fetching, error }] = useGetMyStampCardPageQuery({
    variables: { facilityId },
    requestPolicy: 'network-only',
  });

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }

  const { viewing, viewer, facility } = data;
  if (!facility || !isFacility(facility)) {
    throw new Error('not found');
  }

  return (
    <NavigationHeaderLayout viewing={viewing} viewer={viewer} facility={facility} disableHomeLink>
      <MyStampCardPageLayout loyaltyCard={viewer.loyaltyCard} />
    </NavigationHeaderLayout>
  );
};

const MyStampCardPageLayout = ({ loyaltyCard }: { loyaltyCard: GetMyStampCardPageQuery['viewer']['loyaltyCard'] }) => {
  if (
    !loyaltyCard ||
    !liff.isInClient() /* 現状、LINEユーザーしかユーザーを追跡できないので、スタンプカード機能はLIFFアプリの場合のみ表示する */
  ) {
    return <StampCardNotFound />;
  }
  const { currentRank, nextRank, activeStampCards } = loyaltyCard;
  const latestStampCard = activeStampCards[activeStampCards.length - 1];
  const remainingPoints = latestStampCard.maxPointPerPage - latestStampCard.currentPoints;
  return (
    <>
      <HeaderWithBackground title={loyaltyCard.loyaltyCard.name} />
      <Flex alignItems="stretch" flexDirection="column" bgColor="mono.white">
        <VStack align="stretch" pt="12px" pb="24px" spacing={0} px={containerMarginX} bg="mono.white">
          <LoyaltyCardRank rankName={currentRank.name} color={currentRank.colorRGB} />
          {nextRank && <RankUpProgress nextRankName={nextRank.name} remainingPoints={remainingPoints} />}
        </VStack>
        <Box bgColor="rgba(239, 239, 239, 0.3)" py="24px">
          <StampCardsCarousel loyaltyCard={loyaltyCard} />
          {/* TODO: スタンプ獲得履歴への導線追加 */}
        </Box>
      </Flex>
      <Box pt="40px" pb="100px" px={containerMarginX} bg="mono.white">
        <LoyaltyCardSystem loyaltyCardSystem={loyaltyCard} />
      </Box>
    </>
  );
};

const StampCardNotFound = () => {
  return (
    <Center py="154px" px={containerMarginX}>
      <NoData icon={<CouponIcon boxSize="64px" />} message="スタンプカードはありません" />
    </Center>
  );
};

const LoyaltyCardRank = ({ rankName, color }: { rankName: string; color: string }) => {
  return (
    <HStack spacing="8px" py="15.5px">
      <LoyaltyCardRankMark color={color} size="lg" />
      <Text className="bold-large">{rankName}</Text>
    </HStack>
  );
};

const RankUpProgress = ({ nextRankName, remainingPoints }: { nextRankName: string; remainingPoints: number }) => {
  return (
    <Center bg="mono.white" borderRadius="4px" borderColor="mono.bg" borderWidth="2px" p="12px">
      <Text className="text-extra-small">
        <Text as="span" className="bold-extra-small">
          {nextRankName}
        </Text>
        {`にランクアップまであと${remainingPoints}個！`}
      </Text>
    </Center>
  );
};
