import React, { useCallback, useEffect, useState } from 'react';
import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useClient } from 'urql';

import { formatPrice } from '@/utils/formatUtils';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { OrderType } from '@/graphql/generated/types';
import { cartPage, tableOrderCartPage } from '@/utils/paths/facilityPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { CartWatcher } from '../CartWatcher';

import { CartFooterButtonPartsFragment } from './FixedCartFooterButton.fragment.generated';
import {
  GetCartForFixedCartFooterButtonDocument,
  GetCartForFixedCartFooterButtonQuery,
  GetCartForFixedCartFooterButtonQueryVariables,
} from './FixedCartFooterButton.query.generated';

export * from './FixedCartFooterButton.fragment.generated';

type Props = {
  orderType: OrderType;
  cart?: CartFooterButtonPartsFragment;
  // カートを監視する時に使うID
  cartRawIdForWatch?: string;
  isTableOrder?: boolean;
};

export const FixedCartFooterButton = ({ orderType, cart, cartRawIdForWatch, isTableOrder }: Props) => {
  // propsで渡ってきた値か、onChangeで変更された値のどちらかを使いたいため、stateに保持する。
  const [cartData, setCartData] = useState<CartFooterButtonPartsFragment | undefined>(cart);
  const [isLoading, setIsLoading] = useState(false);

  const facilityId = useFacilityId();
  const gqlClient = useClient();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  useEffect(() => {
    setCartData(cart);
  }, [cart]);

  const handleOnChangeCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await gqlClient.query<
        GetCartForFixedCartFooterButtonQuery,
        GetCartForFixedCartFooterButtonQueryVariables
      >(
        GetCartForFixedCartFooterButtonDocument,
        {
          facilityId,
          orderType,
        },
        { requestPolicy: 'network-only' },
      );
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
      if (data?.viewer?.cart) {
        setCartData(data.viewer.cart);
      }
    } finally {
      setIsLoading(false);
    }
  }, [facilityId, gqlClient, handleErrorWithAlertDialog, orderType]);

  return (
    <>
      <FixedCartFooterButtonLayout
        cart={cartData}
        orderType={orderType}
        isTableOrder={isTableOrder}
        isLoading={isLoading}
      />
      {cartRawIdForWatch && <CartWatcher cartRawId={cartRawIdForWatch} onChangeCart={handleOnChangeCart} />}
    </>
  );
};

const FixedCartFooterButtonLayout = ({
  orderType,
  cart,
  isTableOrder,
  isLoading,
}: {
  orderType: OrderType;
  cart?: CartFooterButtonPartsFragment;
  isTableOrder?: boolean;
  isLoading: boolean;
}) => {
  const facilityId = useFacilityId();
  const router = useTenantRouter();
  const { showPriceExcludingTax } = useFeatureFlags();

  const cartPageUrl = isTableOrder ? tableOrderCartPage(facilityId) : cartPage(facilityId, orderType);

  const handleClick = useCallback(() => {
    router.push(cartPageUrl);
  }, [cartPageUrl, router]);

  if (!cart || cart.totalQuantity < 1) {
    return null;
  }
  const { totalPrice, totalQuantity } = cart;

  return (
    <Button
      zIndex="sticky"
      as="a"
      colorScheme="brand"
      rounded="0"
      h="56px"
      p="18px"
      w="full"
      position="sticky"
      bottom="0"
      left="auto"
      onClick={handleClick}
      isLoading={isLoading}
      _hover={{ cursor: 'pointer', bg: 'brand.primaryText' }}
      _loading={{ opacity: 1 }}
    >
      <HStack align="center" justify="space-between" w="full">
        <HStack spacing="10px">
          <Icon as={ShoppingCartIcon} boxSize="24px" />
          <Text className="bold-small">
            {totalQuantity}点{!showPriceExcludingTax && ` ${formatPrice(totalPrice)}`}
          </Text>
        </HStack>
        <HStack spacing="5px">
          <Text className="text-small">カートを見る</Text>
          <Icon as={ChevronRightIcon} boxSize="24px" />
        </HStack>
      </HStack>
    </Button>
  );
};
