import React, { FC } from 'react';
import { Text, ListItem, UnorderedList, HStack, VStack } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';
import { formatPrice } from '@/utils/formatUtils';
import { ModalDialog } from '@/components/ui/ModalDialog';

import { OrderItemOptionItemsText } from '../OrderItemOptionItemsText';
import { CartMenuItemFragment } from '../CartMenuItem/CartMenuItem.fragment.generated';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  orderItems: CartMenuItemFragment[];
};

export const OrderItemsDialog: FC<Props> = ({ isOpen, onClose, orderItems }: Props) => {
  const closeAction = {
    text: '閉じる',
    onClick: onClose,
  };
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="注文履歴" secondaryAction={closeAction}>
      <UnorderedList styleType="none" marginStart="0px" spacing="16px">
        {orderItems.map((item, index) => (
          <ListItem key={index}>
            <HStack align="top">
              <Text
                px="6px"
                border="2px"
                borderRadius="4px"
                borderColor={variables.monoPrimary}
                className="bold-small"
                height="24px"
              >
                {item.quantity}
              </Text>
              <VStack width="100%" alignItems="left">
                <Text className="bold-small">{item.name}</Text>
                <Text className="text-extra-small">
                  <OrderItemOptionItemsText orderItem={item} />
                </Text>
              </VStack>
              <Text className="bold-small">{formatPrice(item.totalPrice)}</Text>
            </HStack>
          </ListItem>
        ))}
      </UnorderedList>
    </ModalDialog>
  );
};
