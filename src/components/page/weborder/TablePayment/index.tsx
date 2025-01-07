import { Box, Text, VStack, Flex, HStack } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { ChargeDetailsFullList } from '@/components/domain/ChargeDetailsFullList';
import { TablePaymentHeader } from '@/components/domain/TableOrderPaymentHeader';
import { GraphQLResult } from '@/graphql/helper';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { CheckCircleIcon } from '@/components/ui/Icons/CheckCircleIcon';
import { TableOrderPaymentSubmit } from '@/components/domain/TableOrderPaymentSubmit';
import { StripeProvider } from '@/utils/stripe/provider';
import { formatPrice } from '@/utils/formatUtils';

import { useTableOrdersPaymentPageQueryQuery } from './TableOrdersPaymentPage.query.generated';
import { TablePaymentMethod } from './TablePaymentMethod';
import { TablePaymentCoupon } from './TablePaymentCoupon';

type PaymentStatus = 'confirm' | 'completed';

const TablePaymentPage: NextPageWithLayout = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('confirm');

  const facilityId = useFacilityId();
  const [result] = useTableOrdersPaymentPageQueryQuery({
    variables: {
      facilityID: facilityId,
    },
    // 画面を開くたびに、最新の注文状況も取得したいため、キャッシュを使わないようにする
    requestPolicy: 'network-only',
  });
  const { data, fetching, error } = result;
  const table = data?.viewer?.table;
  const payments = data?.viewer?.payments;
  const coupons = data?.viewer?.coupons.nodes;

  const isCompleted = paymentStatus == 'completed' || (fetching == false && table?.order?.orderId == null);

  useLoadingOverlay(fetching && paymentStatus == 'confirm');
  if (error) {
    throw error;
  }

  const handleOnAfterTableOrderPaymentSubmitted = useCallback(() => {
    setPaymentStatus('completed');
  }, []);

  const paymentSelected = payments?.find((p) => p.isSelected && p.paymentType == 'CARD') ? true : false;

  const canSubmitOrder = useMemo(() => {
    if (!table?.order?.orderId) return false;
    if (!paymentSelected) return false;
    if (table?.charge?.details.length == 0) return false;
    return true;
  }, [table?.order?.orderId, paymentSelected, table?.charge?.details]);

  if (isCompleted) {
    return (
      <TablePaymentCompleted
        facility={data?.facility}
        tableName={table?.name || ''}
        customerCount={table?.order?.customerCount || 0}
        amount={table?.charge?.amount || 0}
      />
    );
  }

  return (
    <>
      <WithFeatureFlagsProvider facility={data?.facility}>
        {data?.viewer?.table && (
          <Box pb="54px">
            {table?.charge && <TablePaymentHeader charge={table?.charge} />}
            <VStack pt="24px" pr="20px" pb="24px" pl="20px" spacing="32px">
              <TablePaymentMethod payments={payments || []} />

              <TablePaymentCoupon coupons={coupons || []} couponId={table?.order?.selectedCouponId || ''} />

              {table?.charge && <ChargeDetailsFullList charge={table?.charge} />}

              <Box>
                <Text className="bold-extra-small" py="16px">
                  お会計後は追加のご注文はできませんのでご注意ください
                </Text>
                <StripeProvider>
                  <TableOrderPaymentSubmit
                    orderId={table?.order?.orderId || ''}
                    amount={table?.charge?.amount || 0}
                    disabled={!canSubmitOrder}
                    onAfterTableOrderPaymentSubmitted={handleOnAfterTableOrderPaymentSubmitted}
                  />
                </StripeProvider>
              </Box>
            </VStack>
          </Box>
        )}
      </WithFeatureFlagsProvider>
    </>
  );
};

type TablePaymentCompletedProps = {
  facility: GraphQLResult | undefined | null;
  tableName: string;
  customerCount: number;
  amount: number;
};

const TablePaymentCompleted = ({ facility, tableName, customerCount, amount }: TablePaymentCompletedProps) => {
  let tableString: string = '';
  if (customerCount == 0) {
    tableString = tableName;
  } else {
    tableString = `${tableName}(${customerCount}人)`;
  }
  return (
    <>
      <WithFeatureFlagsProvider facility={facility}>
        <Flex direction="column" justify="center" align="center" h="100vh" w="full">
          <Box pb="54px" w="full" px="20px">
            <VStack spacing="32px">
              <Text className="bold-large">お会計ありがとうございました</Text>
              <CheckCircleIcon width="171" height="170" color="brand.primary" />
              <Text className="bold">退店時にこの画面をスタッフにお見せください</Text>

              <Box
                bgColor="brand.backgroundSoft"
                w="full"
                padding="16px 20px"
                my="20px"
                height="115px"
                alignContent="center"
                borderRadius="8px"
              >
                {tableString != '' && (
                  <HStack spacing="8px" justifyContent="space-between">
                    <Text>座席番号</Text>
                    <Text className="bold-medium">{tableString}</Text>
                  </HStack>
                )}
                {amount > 0 && (
                  <HStack spacing="8px" justifyContent="space-between" marginTop="16px">
                    <Text>合計</Text>
                    <Text className="bold-medium">{formatPrice(amount)}</Text>
                  </HStack>
                )}
              </Box>
            </VStack>
          </Box>
        </Flex>
      </WithFeatureFlagsProvider>
    </>
  );
};

export default TablePaymentPage;
