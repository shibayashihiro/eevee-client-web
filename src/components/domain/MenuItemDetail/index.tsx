import { UrlObject } from 'url';

import React, { FC } from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { OwnerComment } from '@/components/domain/OwnerComment';
import { MenuItemDetailOption } from '@/components/domain/MenuItemDetailOption';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import { OrderType } from '@/graphql/generated/types';
import { CartItemEditProvider, InitialOrderItemForCartItemEditFragment } from '@/providers/CartItemEditProvider';
import { useRefMap } from '@/hooks/useRefMap';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';

import { OptionItemSubOptionEditDialogProvider } from '../OptionItemSubOptionEditDialog';

import { MenuItemDetailPartsFragment } from './MenuItemDetail.fragment.generated';
import { MenuItemDetailActions } from './MenuItemDetailActions';

export * from './MenuItemDetail.fragment.generated';

type Props = {
  menuItem: MenuItemDetailPartsFragment;
  cartId: string;
  orderType: OrderType;
  hasDeliveryAddress: boolean;
  initialOrderItem?: InitialOrderItemForCartItemEditFragment | null;
  backTo?: UrlObject;
};

export const MenuItemDetail: FC<Props> = ({
  menuItem,
  cartId,
  orderType,
  hasDeliveryAddress,
  initialOrderItem,
  backTo,
}: Props) => {
  const { isAnonymous } = useAuthUser();

  const { getNode, handleRefCallback } = useRefMap<HTMLDivElement>();

  const scrollToOption = (optionId: string) => {
    const node = getNode(optionId);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  return (
    <CartItemEditProvider menuItem={menuItem} initialOrderItem={initialOrderItem}>
      <Text className="bold-large" mt="40px" mx={containerMarginX}>
        {menuItem.name}
      </Text>
      <Image
        src={menuItem.image}
        alt={`${menuItem.name}の商品画像`}
        mt="16px"
        w="100%"
        h={{ base: '249px', md: '426px' }}
        objectFit="cover"
        objectPosition={'50% 50%'}
      />
      <VStack align="stretch" mx={containerMarginX} mt="16px" spacing="16px">
        {menuItem.description && <Text whiteSpace="pre-line">{menuItem.description}</Text>}
        {menuItem.ownerComment && <OwnerComment ownerComment={menuItem.ownerComment} />}
      </VStack>
      <VStack mx={containerMarginX} mt="40px" spacing="40px" align="start">
        {!menuItem.orderStatus.viewerCanAddToCart && (
          <SuspendedBanner title={menuItem.orderStatus.reasonViewerCannotAddToCart ?? '現在注文できません。'} />
        )}
        <OptionItemSubOptionEditDialogProvider>
          {menuItem.options.map((option) => (
            <MenuItemDetailOption key={option.id} ref={handleRefCallback(option.id)} menuItemOption={option} />
          ))}
        </OptionItemSubOptionEditDialogProvider>
      </VStack>

      <Box mt="40px" mb="120px">
        {/* 画面下部にカート追加ボタンが固定されるので、大きめに下マージンをとる */}
        <MenuItemDetailActions
          orderType={orderType}
          taxRateType={menuItem.taxRateType}
          cartId={cartId}
          orderItemId={initialOrderItem?.id}
          shouldRegisterAddress={orderType == OrderType.Delivery && (isAnonymous || !hasDeliveryAddress)}
          viewerCanAddToCart={menuItem.orderStatus.viewerCanAddToCart}
          scrollToOptionById={scrollToOption}
          backTo={backTo}
        />
      </Box>
    </CartItemEditProvider>
  );
};
