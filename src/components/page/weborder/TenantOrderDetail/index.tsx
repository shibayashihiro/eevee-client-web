import { Box, Button, Container, Flex, useDisclosure, VStack, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderItemsSummary } from '@/components/domain/OrderDetail/OrderItemsSummary';
import { PhoneCallConfirmDialog } from '@/components/domain/PhoneCallConfirmDialog';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { myPageOrderDetail, myPageOrderHistory } from '@/utils/paths/tenantPages';
import { isCanceledError } from '@/utils/errors';
import { ModalDialog } from '@/components/ui/ModalDialog';

import {
  GetTenantOrderDetailQuery,
  OrderForSubmittedDialogFragment,
  useGetTenantOrderDetailQuery,
} from './TenantOrderDetail.query.generated';
import { InProgressOrderStatusViewTakeout } from './InProgressOrderStatusViewTakeout';
import { CompletedOrderStatusView } from './CompletedOrderStatusView';
import { InProgressOrderStatusViewDelivery } from './InProgressOrderStatusViewDelivery';

export const TenantOrderDetailPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { orderId } = router.query;
  if (typeof orderId !== 'string') {
    throw new Error('orderId is invalid');
  }
  // 注文完了画面から遷移してきた場合にダイアログを表示するため、クエリパラメータを参照する
  const fromSubmitOrder = router.query.fromSubmitOrder === 'true';
  return (
    <Flex h="100vh" direction="column">
      <InsideNavbar title="注文詳細" onClickBackIcon={() => router.push(myPageOrderHistory)} />
      <Container flex={1} pt="24px" pb="40px" px={{ base: '20px', md: '0px' }}>
        <TenantOrderDetailPageBody orderId={orderId} fromOrderSubmit={fromSubmitOrder} />
      </Container>
    </Flex>
  );
};

const TenantOrderDetailPageBody = ({ orderId, fromOrderSubmit }: { orderId: string; fromOrderSubmit: boolean }) => {
  const [{ data, error, fetching }] = useGetTenantOrderDetailQuery({
    variables: { orderID: orderId },
    requestPolicy: 'network-only', // 画面を開くたびに最新を取得
  });

  if (fetching) {
    return <LoadingSpinner />;
  }
  // 進行中の注文でキャンセルステータスのものがあると、APIがエラーを返してくるため無視する。
  // (eevee-clientの仕様の都合でAPIを直せない)
  if (error && !isCanceledError(error)) {
    throw error;
  }
  if (!data?.order) {
    throw new Error('data not found');
  }
  if (
    data.order.__typename !== 'TakeoutOrder' &&
    data.order.__typename !== 'DeliveryOrder' &&
    data.order.__typename !== 'EatInOrder'
  ) {
    throw new Error('order type is invalid');
  }

  const { order } = data;

  const isCompleted =
    (order.__typename === 'TakeoutOrder' || order.__typename === 'DeliveryOrder') && order.completionStatus != null;
  return (
    <>
      <Flex flexDirection="column">
        {order.progress && (
          <Box mb="24px">
            <InProgressOrderStatusView order={order} />
          </Box>
        )}
        {isCompleted && (
          <Box mb="40px">
            <CompletedOrderStatusView order={order} />
          </Box>
        )}
        <OrderItemsSummary order={order} />
        {isCompleted && (
          <Box mt="40px">
            <ContactButton phoneNumber={order.facility.phoneNumber} />
          </Box>
        )}
      </Flex>
      <OrderSubmittedDialog order={order} isOpen={fromOrderSubmit} />
    </>
  );
};

const InProgressOrderStatusView = ({ order }: { order: NonNullable<GetTenantOrderDetailQuery['order']> }) => {
  switch (order.__typename) {
    case 'TakeoutOrder':
      return <InProgressOrderStatusViewTakeout order={order} />;
    case 'DeliveryOrder':
      return <InProgressOrderStatusViewDelivery order={order} />;
  }
  return null;
};

const ContactButton = ({ phoneNumber }: { phoneNumber: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="secondary" h="48px" onClick={onOpen}>
        注文について店舗に問い合わせる
      </Button>
      <PhoneCallConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="注文について店舗に問い合わせる"
        tel={phoneNumber}
      />
    </>
  );
};

const OrderSubmittedDialog = ({ order, isOpen }: { order: OrderForSubmittedDialogFragment; isOpen: boolean }) => {
  const router = useTenantRouter();
  const [showDialog, setShowDialog] = useState(isOpen);

  const onClose = useCallback(() => {
    setShowDialog(false);
    router.replace(
      myPageOrderDetail(order.id),
      undefined,
      { shallow: true }, // ページの再読み込みを防ぐ
    );
  }, [order.id, router]);

  const onClickClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <ModalDialog
      title="注文が完了しました"
      isOpen={showDialog}
      onClose={onClose}
      primaryAction={{
        text: '閉じる',
        onClick: onClickClose,
      }}
    >
      {order.__typename === 'TakeoutOrder' && <TakeoutOrderSubmittedDialogBody order={order} />}
      {order.__typename === 'DeliveryOrder' && <DeliveryOrderSubmittedDialogBody />}
    </ModalDialog>
  );
};

const TakeoutOrderSubmittedDialogBody = ({ order }: { order: OrderForSubmittedDialogFragment }) => {
  return (
    <VStack align="stretch" spacing="16px">
      <Text textStyle="text-small">
        ご注文ありがとうございます。
        <br />
        受け取り時間までに店舗へお越しください
      </Text>
      {order.progress && (
        <VStack as="dl" align="stretch" spacing="4px" py="16px" bgColor="mono.backGround" borderRadius="12px">
          <Text as="dt" textStyle="bold-extra-small" textAlign="center">
            受け取り時間
          </Text>
          <Text as="dd" fontSize="24px" fontWeight="bold" lineHeight="33.6px" textAlign="center">
            {order.progress?.scheduledTime}
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

const DeliveryOrderSubmittedDialogBody = () => {
  return (
    <Text textStyle="text-small">
      ご注文ありがとうございます。
      <br />
      商品のお届けまでおまちください
    </Text>
  );
};
