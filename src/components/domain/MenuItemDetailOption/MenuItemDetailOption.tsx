import React, { forwardRef } from 'react';
import { Box, Divider, Text, VStack } from '@chakra-ui/react';

import { useCartItemEditState } from '@/providers/CartItemEditProvider';
import { resolveMenuItemOptionInputType } from '@/utils/domain/menuItemOption';
import { InputErrorMessage } from '@/components/ui/InputErrorMessage';
import { containerMarginX } from '@/utils/constants';

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
    <Box ref={ref} w="full" px={containerMarginX} pb="16px" bg={errorMessage ? 'mono.errorBackground' : 'transparent'}>
      <VStack align="start" spacing="4px" py="16px">
        <VStack align="start" spacing="4px" position={'sticky'}>
          <Text className="bold-medium">{menuItemOption.name}</Text>
          {!errorMessage && <OptionIsRequiredChip option={menuItemOption} />}
        </VStack>
        {errorMessage && <InputErrorMessage message={errorMessage} />}
      </VStack>
      <VStack
        spacing={0}
        divider={<Divider as="div" borderColor={dividerColor} />}
        bg="mono.white"
        borderRadius="4px"
        pl="12px"
      >
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
    </Box>
  );
});
