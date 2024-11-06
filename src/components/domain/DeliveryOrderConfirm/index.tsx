import React, { FC, useCallback, useMemo, useState } from 'react';
import { Box, HStack, Icon, Link, Text, useDisclosure } from '@chakra-ui/react';
import PostAddIcon from '@mui/icons-material/PostAdd';

import { OrderType } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useGetCartForDeliveryOrderConfirmQuery } from '@/components/domain/DeliveryOrderConfirm/DeliveryOrderConfirm.query.generated';
import { localizedMessages } from '@/utils/errors';
import { isCart, isDeliveryOrder as isDeliveryOrderType, isFacility } from '@/graphql/helper';
import { DeliveryOrderConfirmController } from '@/components/domain/DeliveryOrderConfirm/DeliveryOrderConfirmController';
import { CartTopBanner } from '@/components/domain/CartTopBanner/CartTopBanner';
import { OrderConfirmCart } from '@/components/domain/OrderConfirmCart';
import variables from '@/styles/variables.module.scss';
import { DeliveryOrderSubmit } from '@/components/domain/DeliveryOrderSubmit';
import { DeliveryAddressMemoInputDialog } from '@/components/domain/DeliveryAddressMemoInputDialog';
import { toFullAddress } from '@/utils/formatUtils';
import { AgeVerificationCheckbox } from '@/components/domain/AgeVerificationCheckbox';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';
import { StripeProvider } from '@/utils/stripe/provider';

import { CartFacilityName } from '../CartFacilityName';

type Props = {
  onAfterOrderSubmitted: (orderId: string) => void;
};

export const DeliveryOrderConfirm: FC<Props> = ({ onAfterOrderSubmitted }) => {
  const facilityId = useFacilityId();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const deliveryAddressMemoInputDialogState = useDisclosure();
  const [ageVerified, setAgeVerified] = useState(false);

  const [result] = useGetCartForDeliveryOrderConfirmQuery({
    variables: {
      facilityID: facilityId,
      orderType: OrderType.Delivery,
    },
    // 注文確認画面では注文の不整合を防ぐために厳密に最新データを取得したいため network-only
    requestPolicy: 'network-only',
  });

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  const cart = data?.viewer.cart;
  const order = cart?.order;

  const cartIsReady = !!cart && isCart(cart);
  const isDeliveryOrder = cartIsReady && !!order && isDeliveryOrderType(order);
  const ageVerificationRequired = order?.items.map((item) => item.menuItem.alcoholicBeverage).includes(true);

  const canSubmitOrder = useMemo(() => {
    if (!order) return false;
    if (!isDeliveryOrder) return false;
    if (ageVerificationRequired && !ageVerified) return false;
    if (order.requirement) return false;
    return true;
  }, [ageVerificationRequired, ageVerified, isDeliveryOrder, order]);

  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (!fetching && (!data || !cart)) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  const handleOnAfterOrderSubmitted = useCallback(() => {
    if (!cartIsReady || !isDeliveryOrder) {
      return;
    }
    onAfterOrderSubmitted(order?.id);
  }, [cartIsReady, isDeliveryOrder, onAfterOrderSubmitted, order]);
  return (
    <WithFeatureFlagsProvider facility={data?.facility}>
      <DeliveryOrderConfirmController queryResult={result} />
      {isDeliveryOrder && order.deliveryAddress != null && (
        <DeliveryAddressMemoInputDialog
          deliveryAddressId={order.deliveryAddress.id}
          initialValue={order.deliveryAddress.memo ?? ''}
          isOpen={deliveryAddressMemoInputDialogState.isOpen}
          onClose={deliveryAddressMemoInputDialogState.onClose}
        />
      )}

      <CartTopBanner />
      {isDeliveryOrder && (
        <Box mt="40px" mr="20px" ml="20px" mb="40px">
          {data?.facility && isFacility(data.facility) && (
            <CartFacilityName facility={data.facility} mt="40px" mb="32px" />
          )}
          <Box mb="16px">
            <Text className="bold-extra-small" pb="8px" color={variables.monoSecondary}>
              お届け先
            </Text>
            <Text className="bold-small">
              {toFullAddress(
                order.deliveryAddress.prefecture,
                order.deliveryAddress.addressLine,
                order.deliveryAddress.buildingName,
                order.deliveryAddress.roomNumber,
              )}
            </Text>
            {order.deliveryAddress?.memo != null && (
              <Text className="text-extra-small">{order.deliveryAddress?.memo}</Text>
            )}
            <HStack className="text-extra-small" justifyContent="end" spacing="14px" mt="8px">
              <HStack alignItems="center" spacing="7px">
                <Icon as={PostAddIcon} color="brand.primaryText" w="18px" h="18px" />
                <Link onClick={deliveryAddressMemoInputDialogState.onOpen} color="brand.primaryText">
                  <Text>配達メモを追加する</Text>
                </Link>
              </HStack>
            </HStack>
          </Box>

          <Box mt="8px" mb="16px">
            <Text
              className="bold-extra-small"
              pb="8px"
              color={variables.monoSecondary}
              borderBottom="1px"
              borderColor={variables.monoBackGround}
            >
              お届け時間
            </Text>
            <Box pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
              <Text className="bold-small">{order.scheduledTime}</Text>
            </Box>
          </Box>

          <OrderConfirmCart
            cartId={cart.id}
            orderType={OrderType.Delivery}
            orderConfirmCartParts={cart}
            paymentDialogFragment={order.availablePayments}
          />

          {order.requirement && (
            <Box bgColor="mono.bg" px="20px" py="20px" mb="40px" alignContent="center">
              {order.requirement.split('\n').map((requirement, index) => (
                <Text className="text-medium" align="center" key={index}>
                  {requirement}
                </Text>
              ))}
            </Box>
          )}
          {ageVerificationRequired && <AgeVerificationCheckbox onChange={setAgeVerified} />}

          <StripeProvider>
            <DeliveryOrderSubmit
              orderId={order.id}
              disabled={!canSubmitOrder}
              onAfterOrderSubmitted={handleOnAfterOrderSubmitted}
            />
          </StripeProvider>
        </Box>
      )}
    </WithFeatureFlagsProvider>
  );
};
