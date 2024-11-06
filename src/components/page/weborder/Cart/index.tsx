import { ParsedUrlQuery } from 'querystring';

import { useCallback, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Flex, Box, Icon, Text } from '@chakra-ui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useToast } from '@chakra-ui/react';

import { EatInOrderConfirm } from '@/components/domain/EatInOrderConfirm';
import { OrderCompleted } from '@/components/domain/OrderCompleted';
import { Navbar } from '@/components/domain/Navbar';
import { NotFoundError } from '@/utils/errors';
import { OrderItem, OrderType } from '@/graphql/generated/types';
import { NextPageWithLayout } from '@/types';
import { DeliveryOrderConfirm } from '@/components/domain/DeliveryOrderConfirm';
import { OrderSubmittedDialog } from '@/components/domain/OrderSubmittedDialog';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { orderDetailPage } from '@/utils/paths/facilityPages';
import { useGlobalLoadingSpinnerDispatch, useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { TakeoutOrderConfirm } from '@/components/domain/TakeoutOrderConfirm';
import { EatInTableOrderConfirm } from '@/components/domain/EatInTableOrderConfirm';
import { CartMenuItemFragment } from '@/components/domain/CartMenuItem/CartMenuItem.fragment.generated';
import { useHomePath } from '@/hooks/domain/useHomePath';
import { isFacility } from '@/graphql/helper';

import { useGetTenantForNavbarQuery } from './Cart.query.generated';

export * from './Cart.query.generated';

type ViewStatus = 'confirm' | 'completed';

type ExpectedQuery = {
  orderType: OrderType;
  tableOrder?: string;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  if (
    query.orderType !== OrderType.EatIn &&
    query.orderType !== OrderType.Delivery &&
    query.orderType !== OrderType.Takeout
  ) {
    return false;
  }
  if (query.tableOrder !== undefined && query.tableOrder !== '' /* フィールドが存在すればtrueとする */) {
    return false;
  }

  return true;
};

export const useOrderSubmittedDialogState = (orderType: OrderType) => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();

  const [orderId, setOrderId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (id: string) => {
      setOrderId(id);
      onOpen();
    },
    [onOpen],
  );

  const handleClose = useCallback(async () => {
    if (!orderId) {
      return;
    }
    onClose();
    await router.push(orderDetailPage(facilityId, orderId, orderType));
  }, [facilityId, onClose, orderId, orderType, router]);

  return {
    orderId,
    isOpen,
    onOpen: handleOpen,
    onClose: handleClose,
  };
};

const Cart: NextPageWithLayout = () => {
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const [viewStatus, setViewStatus] = useState<ViewStatus>('confirm');
  const [orderedItems, setOrderedItems] = useState<CartMenuItemFragment[]>([]);
  const toast = useToast();
  const facilityId = useFacilityId();

  const router = useTenantRouter();
  if (!isValidQuery(router.query)) {
    throw new Error('cart: invalid query');
  }
  const { orderType } = router.query;
  const isTableOrder = router.query.tableOrder !== undefined;
  const orderSubmittedDialogState = useOrderSubmittedDialogState(orderType);
  const [result] = useGetTenantForNavbarQuery({
    variables: {
      facilityId,
    },
  });
  const home = useHomePath(orderType);

  const onAfterOrderSubmittedForEatIn = useCallback(
    async (orderItems: OrderItem[]) => {
      setViewStatus('completed');
      setOrderedItems(orderItems);
      if (isTableOrder) {
        await router.push(home);
        setLoading(false);
        toast({
          status: 'success',
          duration: 5000,
          isClosable: true,
          render: () => <TableOrderCompletedToast />,
        });
      }
    },
    [router, home, isTableOrder, setLoading, toast],
  );

  const onAfterOrderSubmittedForDelivery = useCallback(
    (orderId: string) => {
      setViewStatus('completed');
      orderSubmittedDialogState.onOpen(orderId);
    },
    [orderSubmittedDialogState],
  );

  const onAfterOrderSubmittedForTakeout = useCallback(
    (orderId: string) => {
      setViewStatus('completed');
      orderSubmittedDialogState.onOpen(orderId);
    },
    [orderSubmittedDialogState],
  );

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (fetching) {
    return null;
  }
  if (error) {
    throw error;
  }
  const { viewer } = data ?? {};
  if (!data || !viewer) {
    throw new NotFoundError();
  }

  return (
    <>
      {data.facility && isFacility(data.facility) && (
        <Navbar viewing={data.tenant} viewer={data.viewer} facility={data.facility} orderType={orderType} />
      )}
      <OrderSubmittedDialog
        isOpen={orderSubmittedDialogState.isOpen}
        onClose={orderSubmittedDialogState.onClose}
        orderType={orderType}
      />

      {/* EatIn */}
      {viewStatus === 'confirm' &&
        orderType == OrderType.EatIn &&
        (isTableOrder ? (
          <EatInTableOrderConfirm onAfterOrderSubmitted={onAfterOrderSubmittedForEatIn} />
        ) : (
          <EatInOrderConfirm onAfterOrderSubmitted={onAfterOrderSubmittedForEatIn} />
        ))}
      {viewStatus === 'completed' && orderType == OrderType.EatIn && (
        <OrderCompleted orderedItems={orderedItems} orderType={OrderType.EatIn} />
      )}

      {/* Delivery */}
      {viewStatus === 'confirm' && orderType == OrderType.Delivery && (
        <DeliveryOrderConfirm onAfterOrderSubmitted={onAfterOrderSubmittedForDelivery} />
      )}

      {/* Takeout */}
      {viewStatus === 'confirm' && orderType == OrderType.Takeout && (
        <TakeoutOrderConfirm onAfterOrderSubmitted={onAfterOrderSubmittedForTakeout} />
      )}
    </>
  );
};

const TableOrderCompletedToast = () => {
  return (
    <Flex width="335px" height="88px" bg="white" color="black" p={4} borderRadius="12px" boxShadow="lg">
      <Box
        boxSize="64px"
        p={3}
        bg="brand.backgroundSoft"
        borderRadius="8px"
        mr="12px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={CheckCircleIcon} boxSize="40px" color="brand.primary" />
      </Box>
      <div>
        <Text className="bold-small">ご注文ありがとうございました</Text>
        <Text className="text-extra-small">商品のお届けまでお待ちください</Text>
      </div>
    </Flex>
  );
};

export default Cart;
