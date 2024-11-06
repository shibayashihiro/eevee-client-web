import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, HStack, Icon, Text, useDisclosure } from '@chakra-ui/react';
import PlaceIcon from '@mui/icons-material/Place';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import liff from '@line/liff';

import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import variables from '@/styles/variables.module.scss';
import { useGetCartForTakeoutOrderConfirmQuery } from '@/components/domain/TakeoutOrderConfirm/TakeoutOrderConfirm.query.generated';
import { OrderType, ScheduledOrderTime } from '@/graphql/generated/types';
import {
  isCart,
  isFacility,
  isTakeoutOrder as isTakeoutOrderType,
  useAdditionalTypeNamesContext,
} from '@/graphql/helper';
import { localizedMessages } from '@/utils/errors';
import { TakeoutOrderConfirmController } from '@/components/domain/TakeoutOrderConfirm/TakeoutOrderConfirmController';
import { CartTopBanner } from '@/components/domain/CartTopBanner/CartTopBanner';
import { OrderConfirmCart } from '@/components/domain/OrderConfirmCart';
import { AgeVerificationCheckbox } from '@/components/domain/AgeVerificationCheckbox';
import { TakeoutOrderSubmit } from '@/components/domain/TakeoutOrderSubmit';
import { FacilityLocationDialog } from '@/components/domain/FacilityLocationDialog';
import { ScheduledOrderTimeListDialog } from '@/components/domain/ScheduledOrderTimeListDialog';
import { UserInput } from '@/components/ui/NamePhoneNumberInput';
import { validatePhoneNumber, validateKana, validateEmail } from '@/utils/validator';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { fromJpPhoneNumber } from '@/utils/formatUtils';
import { StripeProvider } from '@/utils/stripe/provider';

import { CartFacilityName } from '../CartFacilityName';

type Props = {
  onAfterOrderSubmitted: (orderId: string) => void;
};

export const TakeoutOrderConfirm: FC<Props> = ({ onAfterOrderSubmitted }) => {
  const facilityId = useFacilityId();
  const { isAnonymous } = useAuthUser();
  const facilityLocationDialogState = useDisclosure();
  const scheduledOrderTimeListDialogState = useDisclosure();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const context = useAdditionalTypeNamesContext<[ScheduledOrderTime]>(['ScheduledOrderTime']);
  const [result] = useGetCartForTakeoutOrderConfirmQuery({
    variables: {
      facilityID: facilityId,
      orderType: OrderType.Takeout,
    },
    requestPolicy: 'network-only',
    context,
  });

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  const cart = data?.viewer.cart;
  const lastOrderInput = data?.viewer.lastOrderInput;
  const order = cart?.order;

  const cartIsReady = !!cart && isCart(cart);
  const isTakeoutOrder = cartIsReady && !!order && isTakeoutOrderType(order);
  const ageVerificationRequired = order?.items.map((item) => item.menuItem.alcoholicBeverage).includes(true);

  const [ageVerified, setAgeVerified] = useState(false);
  const [lastNameKana, setLastNameKana] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (lastOrderInput && isInitialLoad) {
      setLastNameKana(lastOrderInput.lastNameKana);
      setPhoneNumber(fromJpPhoneNumber(lastOrderInput.phoneNumber));
      setEmail(lastOrderInput.email);
      setIsInitialLoad(false);
    }
  }, [lastOrderInput, isInitialLoad]);

  const canSubmitOrder = useMemo(() => {
    if (!order) return false;
    if (!isTakeoutOrder) return false;
    if (ageVerificationRequired && !ageVerified) return false;
    if (isAnonymous && (!validateKana(lastNameKana) || !validatePhoneNumber(phoneNumber) || !validateEmail(email)))
      return false;
    if (liff.isInClient() && (!validateKana(lastNameKana) || !validatePhoneNumber(phoneNumber))) return false;
    return true;
  }, [ageVerificationRequired, ageVerified, isTakeoutOrder, lastNameKana, order, phoneNumber, email, isAnonymous]);

  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (!fetching && (!data || !cart)) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  const handleOnAfterOrderSubmitted = useCallback(() => {
    if (!cartIsReady || !isTakeoutOrder) {
      return;
    }
    onAfterOrderSubmitted(order?.id);
  }, [cartIsReady, isTakeoutOrder, onAfterOrderSubmitted, order]);
  return (
    <WithFeatureFlagsProvider facility={data?.facility}>
      <TakeoutOrderConfirmController queryResult={result} />
      <CartTopBanner />
      <FacilityLocationDialog
        isOpen={facilityLocationDialogState.isOpen}
        onClose={facilityLocationDialogState.onClose}
      />
      <ScheduledOrderTimeListDialog
        isOpen={scheduledOrderTimeListDialogState.isOpen}
        onClose={scheduledOrderTimeListDialogState.onClose}
        orderType={OrderType.Takeout}
      />
      {isTakeoutOrder && (
        <form autoComplete="on">
          <Box mt="40px" mr="20px" ml="20px">
            {data.facility && isFacility(data.facility) && <CartFacilityName facility={data.facility} mt="40px" />}
            <HStack className="text-extra-small" justifyContent="end" spacing="14px" mt="8px">
              <HStack alignItems="center" spacing="7px">
                <Icon as={PlaceIcon} color="brand.primaryText" w="18px" h="18px" />
                <Text color="brand.primaryText" onClick={facilityLocationDialogState.onOpen}>
                  お店の場所を確認する
                </Text>
              </HStack>
            </HStack>

            <Box mt="32px" mb="16px">
              <Text
                className="bold-extra-small"
                pb="8px"
                color={variables.monoSecondary}
                borderBottom="1px"
                borderColor={variables.monoBackGround}
              >
                受け取り時間
              </Text>
              <Box pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
                <HStack onClick={scheduledOrderTimeListDialogState.onOpen} justifyContent="space-between">
                  <Text className="bold-small">{order.scheduledTime}</Text>
                  <Icon as={ChevronRightIcon} color="brand.primaryText" w="24px" h="24px" ml="8px" />
                </HStack>
              </Box>
            </Box>

            <OrderConfirmCart
              cartId={cart.id}
              orderType={OrderType.Takeout}
              orderConfirmCartParts={cart}
              paymentDialogFragment={order.availablePayments}
            />

            {(isAnonymous || liff.isInClient()) && (
              <UserInput
                lastNameKana={lastNameKana}
                phoneNumber={phoneNumber}
                email={email}
                setLastNameKana={setLastNameKana}
                setPhoneNumber={setPhoneNumber}
                setEmail={setEmail}
              />
            )}

            {ageVerificationRequired && <AgeVerificationCheckbox onChange={setAgeVerified} />}

            <StripeProvider>
              <TakeoutOrderSubmit
                orderId={order.id}
                lastNameKana={lastNameKana}
                phoneNumber={phoneNumber}
                email={email}
                disabled={!canSubmitOrder}
                onAfterOrderSubmitted={handleOnAfterOrderSubmitted}
              />
            </StripeProvider>
          </Box>
        </form>
      )}
    </WithFeatureFlagsProvider>
  );
};
