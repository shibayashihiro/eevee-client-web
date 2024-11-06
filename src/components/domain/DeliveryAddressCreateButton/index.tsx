import React, { useCallback } from 'react';
import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import SearchIcon from '@mui/icons-material/Search';

import { deliveryAddressAddPage } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

export const DeliveryAddressCreateButton = () => {
  const router = useTenantRouter();

  const handleOnClick = useCallback(() => {
    const addUrl = deliveryAddressAddPage(router.asPath);
    router.push(addUrl);
  }, [router]);

  return (
    <Button color="mono.primary" bg="mono.bg" h="64px" w="full" rounded="20px" onClick={handleOnClick}>
      <HStack align="center">
        <Icon as={SearchIcon} boxSize="24px" />
        <Text className="bold-small">住所・ビル名・地名で登録</Text>
      </HStack>
    </Button>
  );
};
