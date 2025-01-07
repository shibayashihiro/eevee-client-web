import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, Text, Image, HStack, Center } from '@chakra-ui/react';

import { Coupon } from '@/graphql/generated/types';
import { ErrorIcon } from '@/components/ui/Icons/ErrorIcon';
import { SwipeButton } from '@/components/ui/SwipeButton';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useSubmitUseCouponMutation } from './CouponDetailCard.mutation.generated';

type CouponDetailCardProps = {
  coupon: Coupon;
};

const CouponDetailCard: React.FC<CouponDetailCardProps> = ({ coupon }) => {
  const [completed, setCompleted] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [{ fetching }, submitUseCoupon] = useSubmitUseCouponMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      setDividerPosition(contentHeight + 8);
    }
  }, [coupon]);
  const handleOnSwiped = async () => {
    const { error } = await submitUseCoupon({ input: { couponId: coupon.id } });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    setCompleted(true);
  };
  return (
    <>
      {coupon.image && (
        <Box overflow="hidden" position="relative" borderRadius="4px 4px 0px 0px">
          <Image src={coupon.image} alt="" maxHeight="250px" objectFit="cover" height="100%" width="100%" />
        </Box>
      )}
      <VStack align="start" bgColor="mono.white" pb="16px" position="relative" overflow="hidden">
        <Box
          position="absolute"
          top={`${dividerPosition}px`} // この値は、タイトル、サブタイトル、クーポンの詳細を含むVStack と、「備考・注意事項」メモのHStackの合計の高さに該当します。
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
            backgroundColor="mono.divider"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
          <Box
            position="absolute"
            right="-8px"
            width="16px"
            height="16px"
            bgColor="mono.divider"
            borderRadius="50%"
            transform="translateY(-50%)"
          />
        </Box>
        <Box
          ref={contentRef}
          w="full"
          borderStyle="dotted"
          borderColor="mono.divider"
          borderBottomWidth="3px"
          borderRadius="md"
          px="20px"
          py="16px"
        >
          <VStack align="start" spacing={0}>
            <Text className="bold-3xl" color="mono.primary">
              {coupon.title}
            </Text>
            <Text className="bold-medium" color="mono.primary" mb="8px">
              {coupon.subTitle}
            </Text>
            {coupon.details.map((detail, index) => (
              <Text className="text-small" key={index} color="mono.primary">
                {detailText(detail)}
              </Text>
            ))}
          </VStack>
          <HStack mt="16px" w="full" justifyContent="flex-end" color="brand.primaryText">
            <ErrorIcon boxSize="16px" />
            <Text className="bold-small">備考・注意事項</Text>
          </HStack>
        </Box>
        {coupon.canManualUse && (
          <CouponManualUseAction
            handleOnSwiped={handleOnSwiped}
            completed={completed}
            isLoading={fetching}
            statusLabel={coupon.statusLabel}
          />
        )}
      </VStack>
    </>
  );
};

const detailText = (detail: { name: string; value: string }) => {
  return detail.name !== '' ? `${detail.name}: ${detail.value}` : detail.value;
};

const CouponManualUseAction: React.FC<{
  handleOnSwiped: () => void;
  completed: boolean;
  isLoading: boolean;
  statusLabel: string;
}> = ({ handleOnSwiped, completed, isLoading, statusLabel }) => {
  if (completed) {
    return (
      <Center w="full" mt="20px" mb="114px">
        <Text className="bold-small" color="mono.primary" textAlign="center">
          {statusLabel || '使用済み(スワイプ)'}
        </Text>
      </Center>
    );
  }
  return (
    <>
      <VStack px="28px" py="20px" align="center" spacing="12px" w="full">
        <Text className="text-small" color="mono.primary" textAlign="center">
          この画面をお店のスタッフに提示してください
        </Text>
        <Text className="text-extra-small" color="mono.secondary" textAlign="center">
          このボタンを操作すると利用済みになってしまいます。必ずお店のスタッフと一緒に操作してください。
        </Text>
      </VStack>
      <VStack px="20px" pt="12px" w="full">
        <SwipeButton
          mainText=" クーポンを利用済みにする "
          completedText=""
          isSwiped={completed}
          onSwiped={handleOnSwiped}
          isLoading={isLoading}
        />
      </VStack>
    </>
  );
};

export default CouponDetailCard;
