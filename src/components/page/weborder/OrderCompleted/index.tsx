import { Button, Container, VStack, Text, Flex } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { CompletedIcon } from '@/components/ui/Icons/CompletedIcon';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { myPageOrderDetail } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

export const OrderCompletedPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { orderId } = router.query;
  if (typeof orderId !== 'string') {
    throw new Error('orderId is invalid');
  }
  return (
    <Flex h="100vh" direction="column">
      <InsideNavbar title="注文完了" />
      <Container
        variant="main"
        flex={1}
        px={{
          base: '20px',
          md: '0px',
        }}
        py="52px"
      >
        <VStack spacing="16px">
          <Text textStyle="bold-large">ご注文ありがとうございました</Text>
          <CompletedIcon boxSize="170px" color="brand.primary" />
          <Text textStyle="bold-small">またのご利用をお待ちしております</Text>
        </VStack>
        <Button
          as="a"
          mt="16px"
          variant="secondary"
          w="full"
          h="48px"
          _hover={{ cursor: 'pointer' }}
          onClick={() => router.replace(myPageOrderDetail(orderId))}
        >
          注文内容を表示する
        </Button>
      </Container>
    </Flex>
  );
};
