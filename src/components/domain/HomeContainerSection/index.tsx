import { Flex, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';

import { containerMarginX } from '@/utils/constants';
import { shopListPage } from '@/utils/paths/tenantPages';
import { PrimaryButton } from '@/components/ui/Button';
import { useTenantRouter, useUICustomization } from '@/providers/tenant/WebOrderPageStateProvider';

type Props = {
  mainVisualImage: string;
};

export const HomeContainer: FC<Props> = ({ mainVisualImage }) => {
  const uiCustom = useUICustomization();
  const router = useTenantRouter();

  const handleClickShopSelectButton = useCallback(() => {
    router.push(shopListPage);
  }, [router]);

  return (
    <>
      <VStack>
        <Image
          src={mainVisualImage}
          alt="メイン画像"
          h={{ base: '187px', md: '320px' }}
          w="full"
          objectFit="cover"
          objectPosition="50% 50%"
        />
      </VStack>
      <Flex direction="column" mt="40px" mx={containerMarginX} alignItems="center">
        <Text className="bold-large" mt="24px">
          まずは注文する店舗を選んでください💡
        </Text>
        <PrimaryButton mt="32px" h="56px" onClick={handleClickShopSelectButton}>
          店舗を選ぶ
        </PrimaryButton>
        {uiCustom?.tenantHomeNoteText && (
          <Text mt="16px" className="bold-extra-small" color="mono.secondary">
            {uiCustom.tenantHomeNoteText}
          </Text>
        )}
      </Flex>
      <Spacer h="64px" />
    </>
  );
};
