import React, { FC } from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { safeImage } from '@/utils/image';
import { OwnerComment } from '@/components/domain/OwnerComment';
import { MenuItemDetailOption } from '@/components/domain/MenuItemDetailOption';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import { NoImage } from '@/components/ui/NoImage';
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
  closeModal?: () => void;
  closeCategoryModal?: () => void;
};

export const MenuItemDetail: FC<Props> = ({
  menuItem,
  cartId,
  orderType,
  hasDeliveryAddress,
  initialOrderItem,
  closeModal,
  closeCategoryModal,
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
      <Image
        src={safeImage(menuItem.image)}
        alt={`${menuItem.name}の商品画像`}
        w="100%"
        h={{ base: '249px', md: '426px' }}
        objectFit="cover"
        objectPosition={'50% 50%'}
        fallback={<NoImage h={{ base: '249px', md: '426px' }} w="full" />}
      />
      <VStack align="stretch" px={containerMarginX} py="16px" spacing="16px">
        {menuItem.description && (
          <Text className="text-small" whiteSpace="pre-line">
            {menuItem.description}
          </Text>
        )}
        {menuItem.ownerComment && <OwnerComment ownerComment={menuItem.ownerComment} />}
      </VStack>
      <VStack spacing="24px" align="start">
        {!menuItem.orderStatus.viewerCanAddToCart && (
          <Box w="full" px={containerMarginX} py="16px">
            <SuspendedBanner title={menuItem.orderStatus.reasonViewerCannotAddToCart ?? '現在注文できません。'} />
          </Box>
        )}
        <OptionItemSubOptionEditDialogProvider>
          {menuItem.options.map((option) => (
            <MenuItemDetailOption key={option.id} ref={handleRefCallback(option.id)} menuItemOption={option} />
          ))}
        </OptionItemSubOptionEditDialogProvider>
      </VStack>

      <Box mb="104px">
        {/* 画面下部にカート追加ボタンが固定されるので、大きめに下マージンをとる */}
        <MenuItemDetailActions
          orderType={orderType}
          taxRateType={menuItem.taxRateType}
          cartId={cartId}
          orderItemId={initialOrderItem?.id}
          shouldRegisterAddress={orderType == OrderType.Delivery && (isAnonymous || !hasDeliveryAddress)}
          viewerCanAddToCart={menuItem.orderStatus.viewerCanAddToCart}
          scrollToOptionById={scrollToOption}
          closeModal={closeModal}
          closeCategoryModal={closeCategoryModal}
        />
      </Box>
    </CartItemEditProvider>
  );
};
