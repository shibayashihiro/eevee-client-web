import React, { FC, useCallback, useMemo } from 'react';
import { Box, Circle, HStack, VStack, Icon, Link, Spacer, Text, useDisclosure, Divider } from '@chakra-ui/react';
import { Add, PostAdd } from '@mui/icons-material';

import variables from '@/styles/variables.module.scss';
import { OrderType } from '@/graphql/generated/types';
import { PaymentDialog } from '@/components/domain/PaymentDialog';
import { PaymentDialogPartsFragment } from '@/components/domain/PaymentDialog/PaymentDialog.fragment.generated';
import { CartDisposableItem } from '@/components/domain/CartDisposableItem';
import { useUpdateDisposableItemMutation } from '@/components/domain/OrderConfirmCart/OrderConfirmCart.mutation.generated';
import { generateMutationId, isEatInOrder } from '@/graphql/helper';
import { deliveryHome, eatInHome, takeoutHome } from '@/utils/paths/facilityPages';
import { couponPage } from '@/utils/paths/tenantPages';
import { useFacilityId, useTenantRouter, useTenantUid } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { PaymentItem } from '@/components/domain/PaymentItem';
import { SecondaryButton } from '@/components/ui/Button';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { OrderMemoInputDialog } from '../OrderMemoInputDialog';
import { TenantPageLink } from '../TenantPageLink';
import { ChargeDetailsFullList } from '../ChargeDetailsFullList';
import { useGetTecAlignmentQuery } from '../TecAlignment/TecAlignment.query.generated';
import { CartMenuItem } from '../CartMenuItem';
import { CartOrderItemList } from '../Cart/CartOrderItemList';
import { CartSubHeader } from '../Cart/CartSubHeader';
import { CartCourseMenuItem } from '../CartCourseMenuItem';

import { OrderConfirmCartPartsFragment } from './OrderConfirmCart.fragment.generated';
import { useItemDeleteDialog, OrderItemDeleteDialog } from './OrderItemDeleteDialog';
import { CourseMenuItemDeleteDialog, useCourseMenuItemDeleteDialog } from './CourseMenuItemDeleteDialog';

type Props = {
  cartId: string;
  orderType: OrderType;
  orderConfirmCartParts: OrderConfirmCartPartsFragment;
  paymentDialogFragment?: PaymentDialogPartsFragment[];
};

type HiddenMemo = {
  [key: string]: boolean;
};

const hiddenMemoByTenantUid: HiddenMemo = {
  UslkVopUCYXlcy8BTuLN: true, // spice theater
};

export const OrderConfirmCart: FC<Props> = ({ cartId, orderType, orderConfirmCartParts, paymentDialogFragment }) => {
  const facilityId = useFacilityId();
  const tenantUid = useTenantUid();
  const itemDeleteDialogState = useItemDeleteDialog();
  const courseMenuItemDeleteDialogState = useCourseMenuItemDeleteDialog();
  const orderMemoDialogState = useDisclosure();
  const paymentDialogState = useDisclosure();

  const [result, updateDisposableItem] = useUpdateDisposableItemMutation();
  const { fetching, error } = result;
  useLoadingOverlay(fetching);

  const [tecAlignmentResult] = useGetTecAlignmentQuery();
  const tecAlignment = tecAlignmentResult.data?.tenant.tecAlignment;

  const { showPriceExcludingTax } = useFeatureFlags();

  const handleChangeDisposableItem = async (itemId: string) => {
    await updateDisposableItem({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        disposableItemId: itemId,
      },
    });
  };

  const addItemLinkUrl = useMemo(() => {
    switch (orderType) {
      case OrderType.EatIn:
        return eatInHome(facilityId);
      case OrderType.Delivery:
        return deliveryHome(facilityId);
      case OrderType.Takeout:
        return takeoutHome(facilityId);
    }
  }, [facilityId, orderType]);

  const router = useTenantRouter();
  const handleAddItemClick = useCallback(() => {
    router.push(addItemLinkUrl);
  }, [addItemLinkUrl, router]);

  const { availableCouponsCount, order } = orderConfirmCartParts;
  if (!order) {
    return null;
  }

  const showCouponSection = orderType == OrderType.Delivery;
  if (error) {
    throw error;
  }
  return (
    <Box pb="40px">
      <OrderItemDeleteDialog
        cartId={cartId}
        itemId={itemDeleteDialogState.selectedItemId}
        isOpen={itemDeleteDialogState.isOpen}
        onClose={itemDeleteDialogState.onClose}
      />
      <CourseMenuItemDeleteDialog
        cartId={cartId}
        item={courseMenuItemDeleteDialogState.selectedItem}
        isOpen={courseMenuItemDeleteDialogState.isOpen}
        onClose={courseMenuItemDeleteDialogState.onClose}
      />
      <OrderMemoInputDialog
        cartId={cartId}
        tenantUid={tenantUid}
        initialValue={order.memo || ''}
        isOpen={orderMemoDialogState.isOpen}
        onClose={orderMemoDialogState.onClose}
      />
      {paymentDialogFragment && (
        <PaymentDialog
          isOpen={paymentDialogState.isOpen}
          onClose={paymentDialogState.onClose}
          fragment={paymentDialogFragment}
        />
      )}
      <CartSubHeader>ご注文内容</CartSubHeader>
      <CartOrderItemList>
        {order.items.map((item) => (
          <CartMenuItem key={item.id} item={item} onClickDelete={itemDeleteDialogState.onOpen} orderType={orderType} />
        ))}
        {isEatInOrder(order) &&
          order.courseMenuItems.map((item) => (
            <CartCourseMenuItem
              key={item.id}
              courseMenuItem={item}
              onClickDelete={() =>
                courseMenuItemDeleteDialogState.onOpen(item.id, item.courseMenu.name, item.entry.name)
              }
              allCartItems={order.courseMenuItems}
            />
          ))}
      </CartOrderItemList>
      <SecondaryButton mt="24px" h="44px" onClick={handleAddItemClick}>
        <HStack alignItems="center" spacing="7px">
          <Icon as={Add} w="18px" h="18px" />
          <Text fontSize="12px">商品を追加する</Text>
        </HStack>
      </SecondaryButton>
      <Divider mt="24px" />
      {tecAlignment || hiddenMemoByTenantUid[tenantUid] ? ( //TEC連携時は、メモが送信できないので、メモを追加するボタンを表示しない
        <Box mt="24px"></Box>
      ) : (
        <>
          <Text className="bold-extra-small" pb="8px" mt="24px" fontSize="12px" color={variables.monoSecondary}>
            お店へのお願いメモ
          </Text>
          {order.memo != null && order.memo != '' ? (
            <>
              <Box mt="8px" mb="8px" p="12px" borderRadius="4px" bg="mono.bg">
                <Text className="text-extra-small">{order.memo}</Text>
              </Box>
              <HStack mb="60px" alignItems="center" spacing="4px" justifyContent="end">
                <Icon as={PostAdd} color="brand.primaryText" w="18px" h="18px" />
                <Link onClick={orderMemoDialogState.onOpen}>
                  <Text color="brand.primaryText">お店へのお願いメモを編集する</Text>
                </Link>
              </HStack>
            </>
          ) : (
            <SecondaryButton mb="60px" h="44px" onClick={orderMemoDialogState.onOpen}>
              <HStack alignItems="center" spacing="7px">
                <Icon as={PostAdd} w="18px" h="18px" />
                <Text fontSize="12px">メモを追加する</Text>
              </HStack>
            </SecondaryButton>
          )}
        </>
      )}
      {order.disposableItems.length > 0 && (
        <Box mt="8px" mb="16px">
          <Text
            className="bold-extra-small"
            pb="8px"
            color={variables.monoSecondary}
            borderBottom="1px"
            borderColor={variables.monoBackGround}
          >
            必要なものにチェックを入れてください
          </Text>
          <VStack>
            {order.disposableItems.map((item) => (
              <Box
                key={item.id}
                color={variables.monoSecondary}
                w="full"
                pt="16px"
                pb="16px"
                borderBottom="1px"
                borderColor={variables.monoBackGround}
              >
                <CartDisposableItem item={item} onChange={handleChangeDisposableItem} />
              </Box>
            ))}
          </VStack>
        </Box>
      )}
      {paymentDialogFragment && (
        <Box mt="8px" mb="16px">
          <Text
            className="bold-extra-small"
            pb="8px"
            color={variables.monoSecondary}
            borderBottom="1px"
            borderColor={variables.monoBackGround}
          >
            お支払い方法
          </Text>
          <HStack pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
            {order.payment && <PaymentItem fragment={order.payment} />}
            {!order.payment && <Text className="bold-small">未設定</Text>}
            <Spacer />
            <Link onClick={paymentDialogState.onOpen}>
              <Text className="text-small" color="brand.primaryText">
                変更する
              </Text>
            </Link>
          </HStack>
        </Box>
      )}
      {showCouponSection && (
        <Box mt="8px" mb="16px">
          <Text
            className="bold-extra-small"
            pb="8px"
            color={variables.monoSecondary}
            borderBottom="1px"
            borderColor={variables.monoBackGround}
          >
            クーポン
          </Text>
          <HStack pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
            {order.coupon && <Text className="bold-small">{order.coupon.title}</Text>}
            {!order.coupon && availableCouponsCount > 0 && (
              <HStack>
                <Text className="bold-small"> 利用可能なクーポンがあります</Text>
                <Circle ml={8} size="20px" bgColor="brand.background">
                  <Text className="bold-extra-small" color="mono.white" align="center">
                    {availableCouponsCount}
                  </Text>
                </Circle>
              </HStack>
            )}
            {!order.coupon && availableCouponsCount == 0 && (
              <Text className="bold-small">利用可能なクーポンがありません</Text>
            )}
            <Spacer />
            <TenantPageLink href={couponPage(cartId, order.coupon?.id)}>
              <Text className="text-small" color="brand.primaryText">
                変更する
              </Text>
            </TenantPageLink>
          </HStack>
        </Box>
      )}
      {/* TEC連携をしていて、かつ税抜き表示をする場合、現状の税抜き価格は厳密でなくズレが起きうるため、小計・合計等詳細は非表示にする。 */}
      {!(showPriceExcludingTax && tecAlignment && orderType == OrderType.EatIn) && <ChargeDetailsFullList charge={order.charge} />}
    </Box>
  );
};
