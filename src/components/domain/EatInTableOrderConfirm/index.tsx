import { Box, Text, VStack } from '@chakra-ui/react';
import { FC, useCallback, useMemo, useState } from 'react';

import { AgeVerificationCheckbox } from '@/components/domain/AgeVerificationCheckbox';
import { CartTopBanner } from '@/components/domain/CartTopBanner/CartTopBanner';
import { OrderConfirmCart } from '@/components/domain/OrderConfirmCart';
import { OrderItem, OrderType } from '@/graphql/generated/types';
import { isCart, isEatInOrder as isEatInOrderType, isFacility } from '@/graphql/helper';
import { useBackHomeIfOrderEmpty } from '@/hooks/domain/useBackHomeIfCartEmpty/useBackHomeIfCartEmpty';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import variables from '@/styles/variables.module.scss';
import { localizedMessages } from '@/utils/errors';

import { CartFacilityName } from '../CartFacilityName';
import { EatInTableOrderSubmit } from '../EatInTableOrderSubmit';
import { CartWatcher } from '../CartWatcher';

import { useGetCartForEatInTableOrderConfirmQuery } from './EatInTableOrderConfirm.query.generated';

type Props = {
  onAfterOrderSubmitted: (orderItems: OrderItem[]) => void;
};

export const EatInTableOrderConfirm: FC<Props> = ({ onAfterOrderSubmitted }) => {
  const [ageVerified, setAgeVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const facilityId = useFacilityId();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result, reexecuteQuery] = useGetCartForEatInTableOrderConfirmQuery({
    variables: {
      facilityID: facilityId,
      orderType: OrderType.EatIn,
    },
    // 注文確認画面では注文の不整合を防ぐために厳密に最新データを取得したいため network-only
    requestPolicy: 'network-only',
    pause: submitted, // 注文送信後はクエリしない
  });
  useBackHomeIfOrderEmpty({
    cart: result.data?.viewer.cart,
    orderType: OrderType.EatIn,
    isError: !!result.error,
    isLoading: result.fetching,
  });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);

  const cart = data?.viewer.cart;
  const order = cart?.order;
  const table = data?.viewer.table;

  const cartIsReady = !!cart && isCart(cart);
  const isEatInOrder = cartIsReady && !!order && isEatInOrderType(order);
  const ageVerificationRequired = order?.items.map((item) => item.menuItem.alcoholicBeverage).includes(true);

  const canSubmitOrder = useMemo(() => {
    if (!order) return false;
    if (!isEatInOrder) return false;
    if (!table) return false;
    if (ageVerificationRequired && !ageVerified) return false;
    return true;
  }, [ageVerificationRequired, ageVerified, isEatInOrder, order, table]);

  const handleOnCartChanged = useCallback(() => {
    if (submitted) {
      return;
    }
    reexecuteQuery();
  }, [reexecuteQuery, submitted]);

  const handleOnAfterOrderSubmitted = useCallback(() => {
    if (!cartIsReady || !isEatInOrder) {
      return;
    }
    setSubmitted(true);
    onAfterOrderSubmitted(order.items);
  }, [cartIsReady, isEatInOrder, onAfterOrderSubmitted, order?.items, setSubmitted]);

  if (error) {
    handleErrorWithAlertDialog(error);
    return null;
  }
  if (!fetching && (!data || !cart || !table)) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
    return null;
  }

  return (
    <WithFeatureFlagsProvider facility={data?.facility}>
      <CartTopBanner />
      {cartIsReady && (
        <Box mt="40px" mr="20px" ml="20px" mb="40px">
          {data?.facility && isFacility(data.facility) && (
            <CartFacilityName facility={data.facility} mt="40px" mb="24px" />
          )}

          {table && (
            <Box mb="24px">
              <CurrentTable tableName={table.name} />
            </Box>
          )}

          <OrderConfirmCart cartId={cart.id} orderType={OrderType.EatIn} orderConfirmCartParts={cart} />

          {isEatInOrder && (
            <>
              {ageVerificationRequired && <AgeVerificationCheckbox onChange={setAgeVerified} />}
              <EatInTableOrderSubmit onAfterOrderSubmitted={handleOnAfterOrderSubmitted} disabled={!canSubmitOrder} />
            </>
          )}
        </Box>
      )}
      {table && <CartWatcher cartRawId={table?.cartRawId} onChangeCart={handleOnCartChanged} />}
    </WithFeatureFlagsProvider>
  );
};

const CurrentTable = ({ tableName }: { tableName: string }) => {
  return (
    <VStack spacing="4px" align="start">
      <Text fontSize="12px" color={variables.monoSecondary} fontWeight="600">
        座席番号
      </Text>
      <Text fontSize="18px" color={variables.monoPrimary} fontWeight="600">
        {tableName}
      </Text>
    </VStack>
  );
};
