import { Text, Badge, HStack, Center, VStack, StackDivider, Spacer, LinkBox } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import liff from '@line/liff';

import { isFacility } from '@/graphql/helper';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { myPageCoupon } from '@/utils/paths/facilityPages';
import { TenantPageLinkOverlay } from '@/components/domain/TenantPageLink';

import { MyPageStampCard } from './MyPageStampCard';
import { GetMyPageQuery, useGetMyPageQuery } from './MyPage.fragment.generated';

export const MyPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  const [{ data, fetching, error }] = useGetMyPageQuery({
    variables: {
      facilityID: facilityId,
      first: 100, // 仮で100をセット。今後ユーザーのクーポン所持数が増えるようであれば修正すること
      isAvailable: true,
    },
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
      <MyPageLayout viewer={viewer} />
    </NavigationHeaderLayout>
  );
};

const MyPageLayout = ({ viewer }: { viewer: GetMyPageQuery['viewer'] }) => {
  const qrCodeData = viewer.membershipCard?.membershipQRCodeData;
  const myPageStampCard = viewer.loyaltyCard ? viewer.loyaltyCard : null;
  const couponCount = viewer.coupons.nodes.length;
  return (
    <>
      <MyPageMemberShipCard qrCodeData={qrCodeData} />
      <MyPageStampCard myPageStampCard={myPageStampCard} />
      <MyPageMenu couponCount={couponCount} />
    </>
  );
};

export const MyPageMemberShipCard = ({ qrCodeData }: { qrCodeData: string }) => {
  if (!liff.isInClient()) {
    return null;
  }

  return (
    <Center
      bg="mono.white"
      borderRadius="8px"
      borderColor="mono.divider"
      borderWidth="0.5px"
      p="20px"
      pr="32px"
      m="20px"
    >
      <HStack align="center" w="full" p="16px" bg="mono.white" borderRadius="8px" justifyContent="space-between">
        <Text fontWeight="bold" color="mono.primary">
          会員証
        </Text>
        <QRCodeSVG value={qrCodeData} size={88} />
      </HStack>
    </Center>
  );
};

const MyPageMenu = ({ couponCount }: { couponCount: number }) => {
  const couponPage = myPageCoupon(useFacilityId());

  return (
    <VStack w="full" spacing="14px" divider={<StackDivider color="mono.divider" />}>
      <Spacer />
      <LinkBox key={1} w="full" alignItems="start">
        <TenantPageLinkOverlay href={couponPage}>
          <HStack w="full" alignItems="center">
            <Text size="16px" ml="20px" color="mono.primary">
              所持しているクーポン
            </Text>
            <Badge
              bg="brand.primary"
              variant="subtle"
              borderRadius="16px"
              h="20px"
              minW="20px"
              alignItems="center"
              justifyContent="center"
              display="inline-flex"
            >
              <Text size="16px" className="bold-extra-small" color="mono.white">
                {couponCount}
              </Text>
            </Badge>
            <Spacer />
            <Icon as={RightIcon} w="24px" h="24px" color="mono.hint" mr="20px" />
          </HStack>
        </TenantPageLinkOverlay>
      </LinkBox>
      <Spacer />
    </VStack>
  );
};
