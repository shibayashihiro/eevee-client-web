import { UrlObject } from 'url';

import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';

import { formatPrice } from '@/utils/formatUtils';
import { IncrementDecrementButton } from '@/components/ui/IncrementDecrementButton';
import { PrimaryButton } from '@/components/ui/Button';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { OrderType, SelectedOptionItemInput, TaxRateType } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import {
  selectCurrentSubtotalPrice,
  useCartItemEditDispatch,
  useCartItemEditState,
} from '@/providers/CartItemEditProvider';
import { generateMutationId } from '@/graphql/helper';
import { useHomePath } from '@/hooks/domain/useHomePath';
import variables from '@/styles/variables.module.scss';
import { containerMarginX } from '@/utils/constants';
import { selectAllSelectedOptionItems, validateOptions } from '@/utils/domain/selectMenuOptionsReducer';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { searchItemPage } from '@/utils/paths/facilityPages';
import { isItemSearchMethodItemCodeForm } from '@/utils/localstorage/item_search_method';
import { useSignInRequiredDialog } from '@/hooks/domain/useSignInRequiredDialog';

import { useAddCartItemMutation, useUpdateCartItemMutation } from './MenuItemDetail.mutation.generated';

export const MenuItemDetailActions = ({
  orderType,
  cartId,
  orderItemId,
  shouldRegisterAddress,
  viewerCanAddToCart,
  scrollToOptionById,
  backTo,
}: {
  orderType: OrderType;
  cartId: string;
  orderItemId?: string;
  taxRateType: TaxRateType;
  shouldRegisterAddress: boolean;
  viewerCanAddToCart: boolean;
  scrollToOptionById: (optionId: string) => void;
  backTo?: UrlObject;
}) => {
  const router = useTenantRouter();
  const state = useCartItemEditState();
  const dispatch = useCartItemEditDispatch();
  const [addCartItemResult, addCartItem] = useAddCartItemMutation();
  const [updateCartItemResult, updateCartItem] = useUpdateCartItemMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { showPriceExcludingTax } = useFeatureFlags();
  const facilityId = useFacilityId();
  const home = useHomePath(orderType);

  const { renderDialog: renderSignInRequiredDialog, onOpen: openSignInRequiredDialog } = useSignInRequiredDialog({
    backTo: home,
  });

  const setQuantity = (quantity: number) => dispatch({ type: 'SET_QUANTITY', payload: quantity });

  const { subtotalPrice, subtotalPriceExcludingTax } = selectCurrentSubtotalPrice(state, orderType);

  const isUpdate = !!orderItemId;

  const handleSubmit = async () => {
    const optionErrors = validateOptions(state.options);

    dispatch({
      type: 'SET_OPTION_ERRORS',
      payload: { optionErrorsById: optionErrors },
    });

    const errorIds = Object.keys(optionErrors);
    if (errorIds.length > 0) {
      scrollToOptionById(errorIds[0]);
      return;
    }

    if (shouldRegisterAddress) {
      openSignInRequiredDialog('宅配・デリバリーで注文するにはログインが必要です');
      return;
    }

    const itemsForInput = selectAllSelectedOptionItems(state.options).map<SelectedOptionItemInput>((item) => {
      const subOptionItems = item.subOptionItems.map((subOptionItem) => ({
        id: subOptionItem.itemId,
        quantity: subOptionItem.quantity,
        subOptionItems: [],
      }));
      return { id: item.itemId, quantity: item.quantity, subOptionItems };
    });

    let result;
    if (isUpdate) {
      result = await updateCartItem({
        input: {
          clientMutationId: generateMutationId(),
          cartId,
          orderItemId,
          quantity: state.quantity,
          selectedOptionItems: itemsForInput,
        },
      });
    } else {
      result = await addCartItem({
        input: {
          clientMutationId: generateMutationId(),
          cartId,
          menuItemId: state.menuItem.id,
          quantity: state.quantity,
          selectedOptionItems: itemsForInput,
        },
      });
    }
    if (result.error) {
      handleErrorWithAlertDialog(result.error);
      return;
    }
    if (isUpdate) {
      await router.push(backTo ?? home);
    } else {
      const isCodeSearchSelected = isItemSearchMethodItemCodeForm();
      //デリバリーは商品コード検索非対応
      if (isCodeSearchSelected && orderType != OrderType.Delivery) {
        await router.push(searchItemPage(facilityId, orderType));
      } else {
        router.push(home);
      }
    }
  };

  return (
    <>
      {/* ボタンを下部固定にする */}
      {/* src/components/ui/FixedFooter のコンポーネントを使うようにしたいが、MenuItemDetailの構造が入り組んでてstickyで動くようにできてないので今は断念 */}
      <Box
        position="fixed"
        bottom={0}
        pt="16px"
        pb="64px"
        w="full"
        maxW={variables.containerMaxWidth}
        px={containerMarginX}
        bgColor="mono.white"
        borderTop="1px"
        borderTopColor="mono.divider"
        zIndex="sticky"
      >
        <HStack justify="space-between" align="center" spacing="20px">
          <IncrementDecrementButton value={state.quantity} onChange={setQuantity} min={1} />
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!viewerCanAddToCart}
            isLoading={addCartItemResult.fetching || updateCartItemResult.fetching}
            h="56px"
          >
            <VStack alignItems="center" px="24px" w="full" spacing="0">
              <Box display="flex" alignItems="center">
                <Text>{isUpdate ? 'カートの内容を更新する' : 'カートに追加する'}</Text>
              </Box>
              <HStack spacing="4px" alignItems="center">
                <Text>{formatPrice(showPriceExcludingTax ? subtotalPriceExcludingTax : subtotalPrice)}</Text>
                {showPriceExcludingTax && <Text className="text-micro">{`(税抜${formatPrice(subtotalPriceExcludingTax)})`}</Text>}
              </HStack>
            </VStack>
          </PrimaryButton>
        </HStack>
      </Box>
      {renderSignInRequiredDialog()}
    </>
  );
};
