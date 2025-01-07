import { VStack } from '@chakra-ui/react';

import { useCartItemEditState, useCartItemEditDispatch } from '@/providers/CartItemEditProvider';
import { MenuItemOptionInputType, menuItemOptionInputTypes } from '@/utils/domain/menuItemOption';
import {
  OptionItemSelectCheckboxItem,
  OptionItemSelectNumberItem,
  OptionItemSelectRadioItem,
} from '@/components/domain/OptionItemSelectListItem';
import { selectSelectedOptionItemsByOptionId } from '@/utils/domain/selectMenuOptionsReducer';

import { useOptionItemSubOptionEditDialog } from '../OptionItemSubOptionEditDialog';
import { OptionItemSubOptionPreviewListItem } from '../OptionItemSubOptionPreviewListItem';

import { MenuItemDetailOptionPartsFragment } from './MenuItemDetailOption.fragment.generated';

type OptionItemFragment = MenuItemDetailOptionPartsFragment['items'][0];

type Props = {
  inputType: MenuItemOptionInputType;
  optionId: string;
  item: OptionItemFragment;
  showImage: boolean;
  maxSelectCount?: number;
  maxSelectCountPerItem?: number;
};

export const MenuItemDetailOptionItem = (props: Props) => {
  const { optionId, item } = props;

  const state = useCartItemEditState();
  const { onOpen: openSubOptionEditDialog } = useOptionItemSubOptionEditDialog();

  const selectedItem = state.options.selectedOptionItems.byId[item.id];
  const subOptionItemsSelected = selectedItem && selectedItem.subOptionItems.length > 0;

  return (
    <VStack py="4px" pr="12px" w="full" align="stretch" spacing="0">
      <OptionItemInput {...props} />
      {subOptionItemsSelected && (
        <VStack align="stretch" spacing="0">
          {item.subOptions.map((subOption) => (
            <OptionItemSubOptionPreviewListItem
              key={subOption.id}
              parentOptionItemId={item.id}
              subOption={subOption}
              openSubOptionEditDialog={() => openSubOptionEditDialog(optionId, item)}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

const OptionItemInput = ({ inputType, ...props }: Props) => {
  switch (inputType) {
    case menuItemOptionInputTypes.radio:
      return <OptionItemRadioInput {...props} />;
    case menuItemOptionInputTypes.checkbox:
      return <OptionItemCheckboxInput {...props} />;
    case menuItemOptionInputTypes.number:
      return <OptionItemNumberInput {...props} />;
    default:
      throw new Error(`implementation error, unknown option item input type: ${inputType}`);
  }
};

const OptionItemRadioInput = ({
  optionId,
  item,
  showImage,
}: {
  optionId: string;
  item: OptionItemFragment;
  showImage: boolean;
}) => {
  const state = useCartItemEditState();
  const dispatch = useCartItemEditDispatch();
  const { onOpen: openSubOptionEditDialog } = useOptionItemSubOptionEditDialog();

  const {
    options: { selectedOptionItems },
  } = state;
  const checked = selectedOptionItems.byId[item.id] !== undefined;

  const handleClickRadio = () => {
    if (!checked && item.subOptions.length > 0) {
      return openSubOptionEditDialog(optionId, item);
    }

    dispatch({
      type: 'TOGGLE_OPTION_ITEM_SELECTION_WITHIN_OPTION',
      payload: {
        optionId,
        itemId: item.id,
      },
    });
  };

  return (
    <OptionItemSelectRadioItem
      item={item}
      checked={checked}
      showImage={showImage}
      onClick={handleClickRadio}
      showNext={item.subOptions.length > 0}
    />
  );
};

const OptionItemCheckboxInput = ({
  optionId,
  item,
  showImage,
  maxSelectCount,
}: {
  optionId: string;
  item: OptionItemFragment;
  showImage: boolean;
  maxSelectCount?: number;
}) => {
  const state = useCartItemEditState();
  const dispatch = useCartItemEditDispatch();
  const { onOpen: openSubOptionEditDialog } = useOptionItemSubOptionEditDialog();

  const checked = state.options.selectedOptionItems.byId[item.id] !== undefined;

  const selectedItemsWithinOption = selectSelectedOptionItemsByOptionId(state.options, optionId);
  const upperLimited = !maxSelectCount ? false : selectedItemsWithinOption.length >= maxSelectCount;

  const disabled = item.status.available ? upperLimited && !checked : true;

  const handleClickCheckbox = () => {
    if (disabled) {
      return;
    }

    if (!checked && item.subOptions.length > 0) {
      return openSubOptionEditDialog(optionId, item);
    }

    dispatch({
      type: 'TOGGLE_OPTION_ITEM_SELECTION',
      payload: {
        optionId,
        itemId: item.id,
      },
    });
  };

  return (
    <OptionItemSelectCheckboxItem
      item={item}
      disabled={disabled}
      checked={checked}
      showImage={showImage}
      onClick={handleClickCheckbox}
      showNext={item.subOptions.length > 0}
    />
  );
};

const OptionItemNumberInput = ({
  optionId,
  item,
  showImage,
  maxSelectCount,
  maxSelectCountPerItem,
}: {
  optionId: string;
  item: OptionItemFragment;
  showImage: boolean;
  maxSelectCount?: number;
  maxSelectCountPerItem?: number;
}) => {
  const state = useCartItemEditState();
  const dispatch = useCartItemEditDispatch();

  const { onOpen: openSubOptionEditDialog } = useOptionItemSubOptionEditDialog();

  const selectedItemsWithinOption = selectSelectedOptionItemsByOptionId(state.options, optionId);
  const currentQuantityWithinOption = selectedItemsWithinOption.reduce((sum, item) => {
    const quantity = !!item ? item.quantity : 0;
    return sum + quantity;
  }, 0);

  const upperLimitedByOption = !maxSelectCount ? false : currentQuantityWithinOption >= maxSelectCount;

  const {
    options: { selectedOptionItems },
  } = state;
  const selected = selectedOptionItems.byId[item.id] !== undefined;

  const currentQuantity = selectedOptionItems.byId[item.id]?.quantity ?? 0;
  const upperLimitedPerItem =
    !maxSelectCountPerItem || maxSelectCountPerItem == 0 ? false : currentQuantity >= maxSelectCountPerItem;

  const handleClickIncrement = () => {
    if (!item.status.available || upperLimitedByOption || upperLimitedPerItem) {
      return;
    }
    if (!selected && item.subOptions.length > 0) {
      return openSubOptionEditDialog(optionId, item);
    }
    dispatch({
      type: 'ADD_OPTION_ITEM_QUANTITY',
      payload: {
        optionId,
        itemId: item.id,
        amount: +1,
      },
    });
  };

  const handleClickDecrement = () => {
    dispatch({
      type: 'ADD_OPTION_ITEM_QUANTITY',
      payload: {
        optionId,
        itemId: item.id,
        amount: -1,
      },
    });
  };

  const hasSubOptions = item.subOptions.length > 0;

  return (
    <OptionItemSelectNumberItem
      item={item}
      showImage={showImage}
      value={currentQuantity}
      disabled={!item.status.available || upperLimitedByOption || upperLimitedPerItem}
      onClickDecrement={handleClickDecrement}
      onClickIncrement={handleClickIncrement}
      onClickNext={() => openSubOptionEditDialog(optionId, item)}
      showNext={hasSubOptions}
    />
  );
};
