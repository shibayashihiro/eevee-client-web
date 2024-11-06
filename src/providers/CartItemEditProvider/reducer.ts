import { SelectedOptionItem } from '@/utils/domain/menuItemOption';
import {
  State as OptionsState,
  init as initOptionsState,
  Action as SelectOptionsAction,
  reducer as optionsReducer,
} from '@/utils/domain/selectMenuOptionsReducer';

import {
  InitialOrderItemForCartItemEditFragment,
  MenuItemForCartItemEditPartsFragment,
} from './CartItemEdit.fragment.generated';

export type State = {
  // 編集対象のItem
  menuItem: MenuItemForCartItemEditPartsFragment;
  quantity: number;

  options: OptionsState;
};

type InitProps = {
  menuItem: MenuItemForCartItemEditPartsFragment;
  initialOrderItem?: InitialOrderItemForCartItemEditFragment | null;
};

export const init = ({ menuItem, initialOrderItem }: InitProps): State => {
  const optionsState = initOptionsState({
    options: menuItem.options,
    initialOptions: initialOrderItem?.selectedOptionItems.map(newSelectedOptionItemFromFragment) ?? undefined,
  });

  return {
    menuItem,
    quantity: initialOrderItem?.quantity ?? 1,
    options: optionsState,
  };
};

const newSelectedOptionItemFromFragment = (
  item: InitialOrderItemForCartItemEditFragment['selectedOptionItems'][0],
): SelectedOptionItem => {
  return {
    optionId: item.optionId,
    itemId: item.optionItem.id,
    quantity: item.quantity,
    subOptionItems: item.subOptionItems.map((subItem) => ({
      optionId: subItem.optionId,
      itemId: subItem.optionItem.id,
      quantity: subItem.quantity,
      subOptionItems: [],
    })),
  };
};

type SetQuantityAction = {
  type: 'SET_QUANTITY';
  payload: number;
};

export type Action = SetQuantityAction | SelectOptionsAction;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_QUANTITY':
      return {
        ...state,
        quantity: action.payload,
      };
    default:
      return {
        ...state,
        options: optionsReducer(state.options, action),
      };
  }
};
