import { MenuItemOptionInputType, menuItemOptionInputTypes } from '@/utils/domain/menuItemOption';
import { selectSelectedOptionItemsByOptionId } from '@/utils/domain/selectMenuOptionsReducer';

import {
  OptionItemSelectCheckboxItem,
  OptionItemSelectNumberItem,
  OptionItemSelectRadioItem,
} from '../OptionItemSelectListItem';

import { useOptionItemSubOptionEditDialog, useOptionItemSubOptionEditDialogState } from './provider';
import { SubOptionItemPartsFragment } from './SubOptionItem.fragment.generated';

type Props = {
  optionId: string;
  inputType: MenuItemOptionInputType;
  item: SubOptionItemPartsFragment;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
};

export const SubOptionItem = (props: Props) => {
  switch (props.inputType) {
    case menuItemOptionInputTypes.radio:
      return <OptionItemRadioInput {...props} />;
    case menuItemOptionInputTypes.checkbox:
      return <OptionItemCheckboxInput {...props} />;
    case menuItemOptionInputTypes.number:
      return <OptionItemNumberInput {...props} />;
    default:
      throw new Error(`implementation error, unknown input type: ${props.inputType}`);
  }
};

const OptionItemRadioInput = ({ optionId, item }: Props) => {
  const { options } = useOptionItemSubOptionEditDialogState();
  const { dispatch } = useOptionItemSubOptionEditDialog();

  const checked = options.selectedOptionItems.ids.includes(item.id);

  const handleClick = () => {
    dispatch({
      type: 'TOGGLE_OPTION_ITEM_SELECTION_WITHIN_OPTION',
      payload: {
        optionId,
        itemId: item.id,
      },
    });
  };
  return <OptionItemSelectRadioItem item={item} checked={checked} onClick={handleClick} showImage={false} />;
};

const OptionItemCheckboxInput = ({ optionId, item, maxSelectCount }: Props) => {
  const { options } = useOptionItemSubOptionEditDialogState();
  const { dispatch } = useOptionItemSubOptionEditDialog();

  const checked = options.selectedOptionItems.ids.includes(item.id);

  const selectedItemsWithinOption = selectSelectedOptionItemsByOptionId(options, optionId);
  const upperLimited = !maxSelectCount ? false : selectedItemsWithinOption.length >= maxSelectCount;
  const disabled = item.status.available ? upperLimited && !checked : true;

  const handleClick = () => {
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
      checked={checked}
      onClick={handleClick}
      showImage={false}
      disabled={disabled}
    />
  );
};

const OptionItemNumberInput = ({ optionId, item, maxSelectCount, maxSelectCountPerItem }: Props) => {
  const { options } = useOptionItemSubOptionEditDialogState();
  const { dispatch } = useOptionItemSubOptionEditDialog();

  const selectedItemsWithinOption = selectSelectedOptionItemsByOptionId(options, optionId);
  const currentQuantityWithinOption = selectedItemsWithinOption.reduce((sum, cur) => sum + cur.quantity, 0);

  const upperLimitedByOption = !maxSelectCount ? false : currentQuantityWithinOption >= maxSelectCount;

  const currentQuantity = options.selectedOptionItems.byId[item.id]?.quantity ?? 0;
  const upperLimitedPerItem = !maxSelectCountPerItem ? false : currentQuantity >= maxSelectCountPerItem;

  const disabled = !item.status.available || upperLimitedByOption || upperLimitedPerItem;

  const handleClickIncrement = () => {
    if (disabled) {
      return;
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
  return (
    <OptionItemSelectNumberItem
      item={item}
      value={currentQuantity}
      disabled={disabled}
      onClickDecrement={handleClickDecrement}
      onClickIncrement={handleClickIncrement}
      showImage={false}
    />
  );
};
