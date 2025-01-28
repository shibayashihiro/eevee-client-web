import { VStack, Text, List, Divider, ListItem } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

import { resolveMenuItemOptionInputType } from '@/utils/domain/menuItemOption';
import { useCartItemEditDispatch, useCartItemEditState } from '@/providers/CartItemEditProvider';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';
import { PrimaryButton } from '@/components/ui/Button';
import { useRefMap } from '@/hooks/useRefMap';
import { InputErrorMessage } from '@/components/ui/InputErrorMessage';
import { selectAllSelectedOptionItems, validateOptions } from '@/utils/domain/selectMenuOptionsReducer';

import { OptionIsRequiredChip } from '../OptionIsRequiredChip';

import { useOptionItemSubOptionEditDialog, useOptionItemSubOptionEditDialogState } from './provider';
import { OptionItemSubOptionEditDialogPartsFragment } from './OptionItemSubOptionEditDialog.fragment.generated';
import { SubOptionItem } from './SubOptionItem';

// CartItemEditProviderに依存している
export const OptionItemSubOptionEditDialog = () => {
  const { isOpen, viewingItem, options: selectedOptions } = useOptionItemSubOptionEditDialogState();
  const { onClose, dispatch: optionsDispatch } = useOptionItemSubOptionEditDialog();

  const cartItemState = useCartItemEditState();
  const cartItemDispatch = useCartItemEditDispatch();

  const { getNode, handleRefCallback } = useRefMap<HTMLDivElement>();

  if (!viewingItem || viewingItem.item.subOptions.length == 0) {
    return null;
  }

  const subOptionId = viewingItem.item.subOptions[0].id;

  const handleClickSubmit = () => {
    const selectedItems = selectAllSelectedOptionItems(selectedOptions);

    const errors = validateOptions(selectedOptions);

    const errorIds = Object.keys(errors);
    if (errorIds.length > 0) {
      optionsDispatch({
        type: 'SET_OPTION_ERRORS',
        payload: {
          optionErrorsById: errors,
        },
      });
      const node = getNode(errorIds[0]);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const parentOptionInputType = resolveMenuItemOptionInputType(
      cartItemState.options.optionRulesById[viewingItem.optionId],
    );
    const payload = {
      optionId: viewingItem.optionId,
      subOptionId: subOptionId,
      itemId: viewingItem.item.id,
      subOptionItems: selectedItems,
    };
    if (parentOptionInputType === 'radio') {
      cartItemDispatch({
        type: 'SET_SUB_OPTION_ITEMS_WITHIN_OPTION',
        payload,
      });
    } else {
      cartItemDispatch({
        type: 'SET_SUB_OPTION_ITEMS',
        payload,
      });
    }
    onClose();
  };

  const hasSelectedItems = selectAllSelectedOptionItems(selectedOptions).length > 0;
  const buttonText = hasSelectedItems ? 'オプションを選択' : 'オプションを選択しない';
  return (
    <SwipeableBottomModal
      title={`${viewingItem.item.name}のオプション選択`}
      isOpen={isOpen}
      onClose={onClose}
      footer={<PrimaryButton onClick={handleClickSubmit}>{buttonText}</PrimaryButton>}
    >
      <VStack spacing="0" align="stretch">
        {viewingItem.item.subOptions.map((option) => (
          <SubOptionInputForm
            key={option.id}
            ref={handleRefCallback(option.id)}
            option={option}
            error={selectedOptions.optionErrorsById[option.id]}
          />
        ))}
      </VStack>
    </SwipeableBottomModal>
  );
};

export type SubOption = Exclude<OptionItemSubOptionEditDialogPartsFragment['subOptions'][0], null | undefined>;

const SubOptionInputForm = forwardRef<HTMLDivElement, { option: SubOption; error?: string }>(
  function SubOptionInputForm(props, ref) {
    const { option, error } = props;
    return (
      <VStack
        ref={ref}
        spacing="16px"
        px="20px"
        py="16px"
        align="stretch"
        bg={error ? 'mono.errorBackground' : 'transparent'}
      >
        <SubOptionTitle option={option} error={error} />
        <SubOptionItems option={option} />
      </VStack>
    );
  },
);

const SubOptionTitle = ({ option, error }: { option: SubOption; error?: string }) => {
  return (
    <VStack spacing="8px" align="start">
      <VStack spacing="2px" align="start">
        <Text className="bold-normal">{option.name}</Text>
        {!error && <OptionIsRequiredChip option={option} />}
      </VStack>
      {error && <InputErrorMessage message={error} />}
    </VStack>
  );
};

const SubOptionItems = ({ option }: { option: SubOption }) => {
  const inputType = resolveMenuItemOptionInputType(option);
  return (
    <List pl="12px" bg="mono.white" borderRadius="4px">
      {option.items.map((item) => (
        <React.Fragment key={item.id}>
          <ListItem pr="12px">
            <SubOptionItem
              optionId={option.id}
              inputType={inputType}
              item={item}
              maxSelectCount={option.maxSelectCount}
              maxSelectCountPerItem={option.maxSelectCountPerItem}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};
