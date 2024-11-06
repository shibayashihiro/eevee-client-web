import { Text, VStack, Box, Center } from '@chakra-ui/react';
import { OrderedList, ListItem, Image, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isFacility } from '@/graphql/helper';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { containerMarginX } from '@/utils/constants';
import { Coupon } from '@/graphql/generated/types';
import { NoData } from '@/components/ui/NoData';
import { CouponIcon } from '@/components/ui/Icons/CouponIcon';

import { useGetMyCouponsQuery } from './MyCoupons.fragment.generated';

export const MyCouponsPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();
  const [tabIndex, setTabIndex] = useState(0);
  const isAvailable = tabIndex === 0;

  const [{ data, fetching, error }] = useGetMyCouponsQuery({
    variables: {
      facilityID: facilityId,
      first: 100, // 仮で100をセット。今後ユーザーのクーポン所持数が増えるようであれば修正すること
      after: null,
      isAvailable: isAvailable,
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

  const coupons = viewer.coupons.nodes;

  return (
    <NavigationHeaderLayout viewing={viewing} viewer={viewer} facility={facility} disableHomeLink>
      <Tabs variant="soft-rounded" index={tabIndex} onChange={(index) => setTabIndex(index)} isLazy isFitted>
        <TabList borderRadius="16px" bgColor="mono.backGround" mx="14px" mt="16px">
          <Tab _selected={{ bg: 'mono.white' }} m="4px" h="40px" borderRadius="12px" textStyle="bold-extra-small">
            利用可能
          </Tab>
          <Tab _selected={{ bg: 'mono.white' }} m="4px" h="40px" borderRadius="12px" textStyle="bold-extra-small">
            利用済/期限切れ
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box>
              {coupons.length === 0 ? (
                <CouponNotFound />
              ) : (
                <OrderedList styleType="none" w="full" ml={0}>
                  {coupons.map((coupon) => (
                    <ListItem pt="16px" key={coupon.id}>
                      <AvailableCoupon key={coupon.id} coupon={coupon} />
                    </ListItem>
                  ))}
                </OrderedList>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              {coupons.length === 0 ? (
                <CouponNotFound />
              ) : (
                <OrderedList styleType="none" w="full" ml={0}>
                  {coupons.map((coupon) => (
                    <ListItem pt="16px" key={coupon.id}>
                      <UnavailableCoupon key={coupon.id} coupon={coupon} />
                    </ListItem>
                  ))}
                </OrderedList>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </NavigationHeaderLayout>
  );
};

const CouponNotFound = () => {
  return (
    <Center py="154px" px={containerMarginX}>
      <NoData icon={<CouponIcon boxSize="64px" />} message="クーポンはありません" />
    </Center>
  );
};

const AvailableCoupon = ({ coupon }: { coupon: Coupon }) => {
  let radius = '4px 4px 4px 4px';
  if (coupon.image) {
    radius = '0px 0px 4px 4px';
  }

  return (
    <>
      {coupon.image && (
        <Box overflow="hidden">
          <Image
            src={coupon.image}
            alt="coupon"
            maxHeight="222px"
            objectFit="cover"
            height="100%"
            width="100%"
            borderRadius="4px 4px 0px 0px"
          />
        </Box>
      )}
      <VStack align="start" bgColor="brand.background" pb="16px" position="relative" borderRadius={radius}>
        <Box
          position="absolute"
          top="92px"
          left={0}
          width="100%"
          height="20px"
          transform="translateY(-50%)"
          zIndex={0}
          pointerEvents="none"
        >
          <Box
            position="absolute"
            left="-8px"
            width="16px"
            height="16px"
            backgroundColor="mono.white"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
          <Box
            position="absolute"
            right="-8px"
            width="16px"
            height="16px"
            bgColor="mono.white"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
        </Box>
        <Box
          w="full"
          borderStyle="dotted"
          borderColor="mono.white"
          borderBottomWidth="3px"
          borderRadius="md"
          px="20px"
          py="16px"
        >
          <Text className="bold-32px" color="mono.white">
            {coupon.title}
          </Text>
        </Box>
        <VStack px="20px" pt="12px" color="mono.white" align="start" spacing="2px">
          <Text className="bold-extra-small">{coupon.subTitle}</Text>
          {coupon.details.map((detail, index) => (
            <Text className="text-extra-small" key={index}>
              {detailText(detail)}
            </Text>
          ))}
        </VStack>
      </VStack>
    </>
  );
};

// TODO: AvailableCoupon と共通点が多いので、共通化できると良さそう
const UnavailableCoupon = ({ coupon }: { coupon: Coupon }) => {
  let radius = '4px 4px 4px 4px';
  if (coupon.image) {
    radius = '0px 0px 4px 4px';
  }

  return (
    <>
      {coupon.image && (
        <Box overflow="hidden" height="100%" width="100%" pb="0" position="relative" borderRadius="4px 4px 0px 0px">
          <Image
            src={coupon.image}
            alt="coupon"
            maxHeight="222px"
            objectFit="cover"
            height="100%"
            width="100%"
            opacity={0.3}
          />
          <Text
            position="absolute"
            top={4}
            left={4}
            backgroundColor="mono.primary"
            color="white"
            padding="2"
            className="bold-medium"
          >
            {coupon.statusLabel}
          </Text>
        </Box>
      )}
      <VStack align="start" bgColor="mono.divider" pb="16px" position="relative" borderRadius={radius}>
        <Box
          position="absolute"
          top="92px"
          left={0}
          width="100%"
          height="20px"
          transform="translateY(-50%)"
          zIndex={0}
          pointerEvents="none"
        >
          <Box
            position="absolute"
            left="-8px"
            width="16px"
            height="16px"
            backgroundColor="mono.white"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
          <Box
            position="absolute"
            right="-8px"
            width="16px"
            height="16px"
            bgColor="mono.white"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
        </Box>

        <Box
          w="full"
          borderStyle="dotted"
          borderColor="mono.white"
          borderBottomWidth="3px"
          borderRadius="md"
          px="20px"
          py="16px"
        >
          <VStack align="start">
            {!coupon.image && (
              <Text backgroundColor="mono.primary" color="white" padding="2" className="bold-medium">
                {coupon.statusLabel}
              </Text>
            )}
            <Text className="bold-32px" color="mono.white">
              {coupon.title}
            </Text>
          </VStack>
        </Box>
        <VStack px="20px" pt="12px" color="mono.white" align="start" spacing="2px">
          <Text className="bold-extra-small">{coupon.subTitle}</Text>
          {coupon.details.map((detail, index) => (
            <Text className="text-extra-small" key={index}>
              {detailText(detail)}
            </Text>
          ))}
        </VStack>
      </VStack>
    </>
  );
};

const detailText = (detail: { name: string; value: string }) => {
  return detail.name !== '' ? `${detail.name}: ${detail.value}` : detail.value;
};
