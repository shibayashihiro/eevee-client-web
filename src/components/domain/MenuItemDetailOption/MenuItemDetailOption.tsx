import React, { forwardRef } from 'react';
import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { useCartItemEditState } from '@/providers/CartItemEditProvider';
import { resolveMenuItemOptionInputType } from '@/utils/domain/menuItemOption';
import { InputErrorMessage } from '@/components/ui/InputErrorMessage';

import { OptionIsRequiredChip } from '../OptionIsRequiredChip';

import { MenuItemDetailOptionItem } from './MenuItemDetailOptionItem';
import { MenuItemDetailOptionPartsFragment } from './MenuItemDetailOption.fragment.generated';

type Props = {
  menuItemOption: MenuItemDetailOptionPartsFragment;
};

const dividerColor = '#DDD';

export const MenuItemDetailOption = forwardRef<HTMLDivElement, Props>(function MenuItemDetailOptionRef(props, ref) {
  const { menuItemOption } = props;
  const {
    options: { optionErrorsById },
  } = useCartItemEditState();

  const { minSelectCount, maxSelectCount, maxSelectCountPerItem, items } = menuItemOption;

  const isIncludedImage = items.some((e) => e.image);

  const errorMessage = optionErrorsById[menuItemOption.id];

  const optionInputType = resolveMenuItemOptionInputType({
    minSelectCount,
    maxSelectCount,
    maxSelectCountPerItem,
  });

  return (
    <Box ref={ref} w="full">
      <VStack align="start" spacing="9px">
        <HStack spacing="6px">
          <Text className="bold-small">{menuItemOption.name}</Text>
          <OptionIsRequiredChip option={menuItemOption} />
        </HStack>
        {errorMessage && <InputErrorMessage message={errorMessage} />}
      </VStack>
      <Divider mt="8px" borderColor={dividerColor} />
      <VStack spacing={0} divider={<Divider as="div" borderColor={dividerColor} />}>
        {menuItemOption.items.map((item) => (
          <MenuItemDetailOptionItem
            key={item.id}
            inputType={optionInputType}
            optionId={menuItemOption.id}
            item={item}
            showImage={isIncludedImage}
            maxSelectCount={menuItemOption.maxSelectCount ?? 0}
            maxSelectCountPerItem={menuItemOption.maxSelectCountPerItem ?? 0}
          />
        ))}
      </VStack>
      <Divider borderColor={dividerColor} />
    </Box>
  );
});
