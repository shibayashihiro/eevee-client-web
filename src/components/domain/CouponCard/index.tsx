import React from 'react';
import { Box, VStack, Text, Image } from '@chakra-ui/react';

import { PrimaryTextColorButton } from '@/components/ui/Button';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { couponDetailPage } from '@/utils/paths/tenantPages';

import { CouponCardForListFragment } from './CouponCard.fragment.generated';

const CouponCard = ({ coupon, isAvailable }: { coupon: CouponCardForListFragment; isAvailable: boolean }) => {
  const radius = coupon.image ? '0px 0px 4px 4px' : '4px 4px 4px 4px';
  const bgColor = isAvailable ? 'brand.primary' : 'mono.divider';
  const titleColor = 'mono.white';
  const overlayOpacity = isAvailable ? 1 : 0.3;
  const canManualUse = isAvailable && coupon.canManualUse;
  const router = useTenantRouter();

  const handleCouponDetailView = () => {
    router.push(couponDetailPage(coupon.id));
  };

  return (
    <>
      {coupon.image && (
        <Box overflow="hidden" position="relative" borderRadius="4px 4px 0px 0px">
          <Image
            src={coupon.image}
            alt={coupon.title}
            maxHeight="222px"
            objectFit="cover"
            height="100%"
            width="100%"
            opacity={overlayOpacity}
          />
          {!isAvailable && (
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
          )}
        </Box>
      )}
      <VStack align="start" bgColor={bgColor} pb="16px" position="relative" borderRadius={radius} spacing={0}>
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
            {!coupon.image && !isAvailable && (
              <Text backgroundColor="mono.primary" color="white" padding="2" className="bold-medium">
                {coupon.statusLabel}
              </Text>
            )}
            <Text className="bold-3xl" color={titleColor}>
              {coupon.title}
            </Text>
          </VStack>
        </Box>
        <VStack px="20px" pt="12px" color="mono.white" align="start" spacing={0}>
          <Text className="bold-extra-small" mb="8px">
            {coupon.subTitle}
          </Text>
          {coupon.details.map((detail, index) => (
            <Text className="text-extra-small" key={index}>
              {detailText(detail)}
            </Text>
          ))}
        </VStack>
        {canManualUse && (
          <Box w="full" mt="20px" px="20px">
            <PrimaryTextColorButton disabled={!isAvailable} onClick={handleCouponDetailView}>
              利用する
            </PrimaryTextColorButton>
          </Box>
        )}
      </VStack>
    </>
  );
};

const AvailableCoupon = ({ coupon }: { coupon: CouponCardForListFragment }) => {
  return <CouponCard coupon={coupon} isAvailable={true} />;
};

const UnavailableCoupon = ({ coupon }: { coupon: CouponCardForListFragment }) => {
  return <CouponCard coupon={coupon} isAvailable={false} />;
};

const detailText = (detail: { name: string; value: string }) => {
  return detail.name !== '' ? `${detail.name}: ${detail.value}` : detail.value;
};

export { AvailableCoupon, UnavailableCoupon };
