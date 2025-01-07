import { Container, Flex, Heading, VStack, Text, Center, Box } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useClient } from 'urql';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageInfoTimeBased } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { myPage } from '@/utils/paths/tenantPages';
import { isCanceledError } from '@/utils/errors';

import { InProgressOrderListItem } from './InProgressOrderListItem';
import {
  GetOrderHistoryDocument,
  GetOrderHistoryQuery,
  GetOrderHistoryQueryVariables,
  OrderForHistoryFragment,
  useGetOrderHistoryQuery,
} from './OrderHistory.query.generated';
import { InProgressOrderListItemFragment } from './InProgressOrderListItem.fragment.generated';
import { OrderHistoryListItem } from './OrderHistoryListItem';
import { OrderHistoryListItemFragment } from './OrderHistoryListItem.fragment.generated';

export const OrderHistoryPage: NextPageWithLayout = () => {
  return (
    <Flex h="100vh" direction="column">
      <Navbar />
      <Container
        flex={1}
        pt="24px"
        // 無限スクロールの実装があるため、色んな端末でloadMoreの判定がおこなわれるように下部は多めに余白を持たせる
        pb="65px"
      >
        <OrderHistoryPageBody />
      </Container>
    </Flex>
  );
};

const fetchLimit = 10;

const Navbar = () => {
  const router = useTenantRouter();
  return <InsideNavbar title="注文履歴" onClickBackIcon={() => router.push(myPage)} />;
};

const OrderHistoryPageBody = () => {
  const [{ data, error, fetching }] = useGetOrderHistoryQuery({
    variables: { first: fetchLimit },
  });
  if (fetching) {
    return <LoadingSpinner />;
  }
  // 進行中の注文でキャンセルステータスのものがあると、APIがエラーを返してくるため無視する。
  // (eevee-clientの仕様の都合でAPIを直せない)
  if (error && !isCanceledError(error)) {
    throw error;
  }
  if (!data?.viewer) {
    throw new Error('data not found');
  }

  const { orders } = data.viewer;
  if (orders.nodes.length === 0) {
    return (
      <Center>
        <Text textStyle="bold-large">まだ注文履歴はありません。</Text>
      </Center>
    );
  }
  return <OrderHistoryListWithPagination initialOrders={orders.nodes} initialPageInfo={orders.pageInfo} />;
};

const OrderHistoryListWithPagination = ({
  initialOrders,
  initialPageInfo,
}: {
  initialOrders: OrderForHistoryFragment[];
  initialPageInfo: PageInfoTimeBased;
}) => {
  const { orders, addOrders } = useOrdersState({ initialOrders });
  const [pageInfo, setPageInfo] = useState<PageInfoTimeBased>(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const gqlClient = useClient();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const loadMore = useCallback(async () => {
    if (loading || !pageInfo.hasNextPage) {
      return;
    }
    setLoading(true);
    const { data, error } = await gqlClient.query<GetOrderHistoryQuery, GetOrderHistoryQueryVariables>(
      GetOrderHistoryDocument,
      {
        first: fetchLimit,
        after: pageInfo.endCursor,
      },
    );
    setLoading(false);
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    if (!data?.viewer?.orders) {
      return;
    }
    addOrders(data.viewer.orders.nodes);
    setPageInfo(data.viewer.orders.pageInfo);
  }, [addOrders, gqlClient, handleErrorWithAlertDialog, loading, pageInfo.endCursor, pageInfo.hasNextPage]);

  const inProgressOrders = orders.filter((order) => order.progress !== null);
  const historyOrders = orders.filter((order) => order.progress === null);
  return (
    <VStack align="stretch" spacing="40px">
      <InfiniteScroll hasMore={pageInfo.hasNextPage} loadMore={loadMore} loader={<LoadingSpinner />}>
        {inProgressOrders.length > 0 && <InProgressOrdersSection orders={inProgressOrders} />}
        {historyOrders.length > 0 && <OrderHistorySection orders={historyOrders} />}
      </InfiniteScroll>
    </VStack>
  );
};

const InProgressOrdersSection = ({ orders }: { orders: InProgressOrderListItemFragment[] }) => {
  return (
    <VStack align="stretch" spacing="16px">
      <SectionHeader title="現在の注文" />
      <VStack as="ul" px={{ base: '20px', md: '0px' }} align="stretch" spacing="24px" listStyleType="none">
        {orders.map((order) => (
          <li key={order.id}>
            <InProgressOrderListItem order={order} />
          </li>
        ))}
      </VStack>
    </VStack>
  );
};

const OrderHistorySection = ({ orders }: { orders: OrderHistoryListItemFragment[] }) => {
  return (
    <VStack align="stretch" spacing={0}>
      <SectionHeader title="注文履歴" />
      <VStack as="ul" px={{ base: '20px', md: '0px' }} align="stretch" spacing={0} listStyleType="none">
        {orders.map((order) => (
          <Box
            as="li"
            key={order.id}
            w="full"
            py="16px"
            borderBottomStyle={'solid'}
            borderBottomWidth="1px"
            borderBottomColor="mono.divider"
          >
            <OrderHistoryListItem order={order} />
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <Heading
      as="h2"
      fontSize="large"
      fontWeight="bold"
      color="mono.primary"
      px={{ base: '20px', md: '0px' }}
      pb="16px"
      borderBottom="1px solid"
      borderColor="mono.divider"
    >
      {title}
    </Heading>
  );
};

/**
 * 重複なしでOrderを管理するState
 */
type OrdersState = {
  ids: string[];
  byId: { [id: string]: OrderForHistoryFragment };
};

const updateOrdersState = (state: OrdersState, order: OrderForHistoryFragment): OrdersState => {
  const isExist = state.byId[order.id];
  return {
    ids: isExist ? state.ids : [...state.ids, order.id],
    byId: { ...state.byId, [order.id]: order },
  };
};

const useOrdersState = ({ initialOrders }: { initialOrders: OrderForHistoryFragment[] }) => {
  const [state, setState] = useState<OrdersState>(() => {
    return initialOrders.reduce<OrdersState>((acc, order) => updateOrdersState(acc, order), { ids: [], byId: {} });
  });

  const addOrders = useCallback((orders: OrderForHistoryFragment[]) => {
    setState((prev) => {
      return orders.reduce((acc, order) => updateOrdersState(acc, order), prev);
    });
  }, []);

  return {
    orders: state.ids.map((id) => state.byId[id]),
    addOrders,
  };
};
