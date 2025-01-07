import React, { useCallback } from 'react';
import { Button, SimpleGrid, Text } from '@chakra-ui/react';

import { SearchIcon } from '@/components/ui/Icons/SearchIcon';
import { MyLocationIcon } from '@/components/ui/Icons/MyLocationIcon';
import { deliveryAddressAddPage, deliveryCurrentAddressAddPage } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

export const AddressRegistrationOptions = () => {
  const router = useTenantRouter();

  const handleOnClickAddressAdd = useCallback(() => {
    const addUrl = deliveryAddressAddPage();
    router.push(addUrl);
  }, [router]);

  const handleOnClickCurrentAddressAdd = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const curAddUrl = deliveryCurrentAddressAddPage({
            latitude,
            longitude,
            srcPageUrl: router.asPath,
          });
          router.push(curAddUrl);
        },
        () => {
          alert('位置情報を取得できませんでした');
        },
      );
    } else {
      alert('このブラウザでは位置情報はサポートされていません');
    }
  }, [router]);

  return (
    <SimpleGrid columns={2} spacing="11px" w="full" mx="auto">
      <Button
        color="mono.primary"
        bg="mono.bg"
        h="88px"
        w="full"
        rounded="20px"
        onClick={handleOnClickAddressAdd}
        display="flex"
        flexDirection="column"
      >
        <SearchIcon boxSize="20px" />
        <Text as="span" mt={2} whiteSpace="normal" textAlign="center">
          郵便番号・住所・地名で登録
        </Text>
      </Button>
      <Button
        color="mono.primary"
        bg="mono.bg"
        h="88px"
        w="full"
        rounded="20px"
        onClick={handleOnClickCurrentAddressAdd}
        display="flex"
        flexDirection="column"
      >
        <MyLocationIcon boxSize="24px" />
        <Text as="span" mt={2} whiteSpace="normal" textAlign="center">
          現在地から登録
        </Text>
      </Button>
    </SimpleGrid>
  );
};
