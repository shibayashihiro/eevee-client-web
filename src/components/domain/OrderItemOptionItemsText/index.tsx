import { Text } from '@chakra-ui/react';

import { OrderItemOptionItemsTextPartsFragment } from './OrderItemOptionItemsText.fragment.generated';

type Props = {
  orderItem: OrderItemOptionItemsTextPartsFragment;
};

export const OrderItemOptionItemsText = ({ orderItem: { selectedOptionItems } }: Props) => {
  const names = selectedOptionItems.map((item) => {
    let name = item.name;
    if (item.subOptionItems.length > 0) {
      const subOptionNames = item.subOptionItems.map((subItem) => {
        const quantityText = subItem.quantity > 1 ? `×${subItem.quantity}` : '';
        return `${subItem.name}${quantityText}`;
      });
      name += `(${subOptionNames.join(' / ')})`;
    }
    return Array.from({ length: item.quantity }).fill(name).join(' / ');
  });
  return <Text className="text-extra-small"> {names.join(' / ')} </Text>;
};
