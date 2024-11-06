import { HStack, VStack, Text, Button } from '@chakra-ui/react';

import { formatOptionItemPrice } from '@/utils/domain/menuItemOption';
import { selectSelectedSubOptionItems, useCartItemEditState } from '@/providers/CartItemEditProvider';

import { OptionItemSubOptionPreviewListItemPartsFragment } from './OptionItemSubOptionPreviewListItem.fragment.generated';

export * from './OptionItemSubOptionPreviewListItem.fragment.generated';

type Props = {
  parentOptionItemId: string;
  subOption: OptionItemSubOptionPreviewListItemPartsFragment;
  openSubOptionEditDialog: () => void;
};

export const OptionItemSubOptionPreviewListItem = ({
  parentOptionItemId,
  subOption,
  openSubOptionEditDialog,
}: Props) => {
  const state = useCartItemEditState();
  const selectedItems = selectSelectedSubOptionItems(state, parentOptionItemId, subOption.id);

  if (selectedItems.length === 0) {
    return null;
  }

  // マスタをitemIDで参照できるようにする
  const subOptionItemById = subOption.items.reduce<
    Record<string, OptionItemSubOptionPreviewListItemPartsFragment['items'][0] | undefined>
  >((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const subOptionItems = selectedItems.map((selectedItem) => {
    const item = subOptionItemById[selectedItem.itemId];
    if (!item) {
      throw new Error(`implementation error, item not found: ${selectedItem.itemId}`);
    }
    return {
      ...item,
      quantity: selectedItem.quantity,
    };
  });

  return (
    <VStack align="stretch" spacing="4px" p="8px" bgColor="brand.backgroundSoft">
      <HStack justify="space-between">
        <Text color="mono.secondary" className="bold-extra-small">
          {subOption.name}
        </Text>
        <Button variant="link" colorScheme="brand" onClick={openSubOptionEditDialog}>
          <Text className="bold-extra-small">変更する</Text>
        </Button>
      </HStack>
      <VStack align="start" spacing="0px">
        {subOptionItems.map((item) => (
          <SubOptionItemAsText key={item.id} name={item.name} price={item.price ?? 0} quantity={item.quantity} />
        ))}
      </VStack>
    </VStack>
  );
};

const SubOptionItemAsText = ({ name, price, quantity }: { name: string; price: number; quantity: number }) => {
  const priceText = price !== 0 ? ` (${formatOptionItemPrice(price)})` : '';
  const quantityText = quantity > 1 ? ` × ${quantity}` : '';
  const displayText = `${name}${priceText}${quantityText}`;
  return (
    <Text className="text-small" lineHeight="140%">
      {displayText}
    </Text>
  );
};
