import { MenuOptionInputRule, SelectedOptionItem, validateSelectedOptionItems } from './menuItemOption';
import { MenuItemOptionForSelectOptionsFragment } from './selectMenuOptionsReducer.fragment.generated';

export type State = {
  // OptionごとのValidation Rule
  optionRulesById: Record<string, MenuOptionInputRule>;
  selectedOptionItems: SelectedOptionItems;

  // OptionIDをキーにした、エラーメッセージのMap
  // ボタン押下後、エラーが解消されても再度ボタンを押すまではエラー表示を消さないために、
  // 「いまエラーかどうか」とは別にStateに保持する。
  optionErrorsById: Record<string, string | undefined>;
};

export const initialState: State = {
  optionRulesById: {},
  selectedOptionItems: {
    ids: [],
    byId: {},
  },
  optionErrorsById: {},
};

type InitProps = {
  options: MenuItemOptionForSelectOptionsFragment[];
  initialOptions?: SelectedOptionItem[];
};

export const init = ({ options, initialOptions }: InitProps): State => {
  const optionRulesById = options.reduce<Record<string, MenuOptionInputRule>>((acc, option) => {
    acc[option.id] = {
      optionId: option.id,
      minSelectCount: option.minSelectCount ?? undefined,
      maxSelectCount: option.maxSelectCount ?? undefined,
      maxSelectCountPerItem: option.maxSelectCountPerItem ?? undefined,
    };
    return acc;
  }, {});

  if (!initialOptions) {
    // 編集でない場合は初期値を返す
    return {
      ...initialState,
      optionRulesById,
    };
  }

  const selectedItemIds = <string[]>[];
  const selectedItemById = <Record<string, SelectedOptionItem>>{};

  for (const selectedItem of initialOptions) {
    selectedItemIds.push(selectedItem.itemId);
    selectedItemById[selectedItem.itemId] = selectedItem;
  }

  return {
    optionRulesById,
    selectedOptionItems: {
      ids: selectedItemIds,
      byId: selectedItemById,
    },
    optionErrorsById: {},
  };
};

/**
 * Actions
 */

type SelectedOptionItems = {
  ids: string[];
  // NOTE: 異なるOptionに同じItemIDが含まれるようになると破綻するので注意
  byId: Record<string, SelectedOptionItem | undefined>;
};

type ToggleOptionItemSelectionAction = {
  type: 'TOGGLE_OPTION_ITEM_SELECTION';
  payload: {
    optionId: string;
    itemId: string;
  };
};

// Optionの中で1つだけ選択できるようなItemの選択状態を切り替える（ラジオボタン向けの挙動）
type ToggleOptionItemSelectionWithinOptionAction = {
  type: 'TOGGLE_OPTION_ITEM_SELECTION_WITHIN_OPTION';
  payload: {
    optionId: string;
    itemId: string;
  };
};

type AddOptionItemQuantityAction = {
  type: 'ADD_OPTION_ITEM_QUANTITY';
  payload: {
    optionId: string;
    itemId: string;
    amount: number;
  };
};

export type SetSubOptionItemsAction = {
  type: 'SET_SUB_OPTION_ITEMS';
  payload: {
    optionId: string;
    itemId: string;
    subOptionItems: SelectedOptionItem[];
  };
};

// Optionの中で1つだけ選択できるOption内でのサブオプション選択
export type SetSubOptionItemsWithinOptionAction = {
  type: 'SET_SUB_OPTION_ITEMS_WITHIN_OPTION';
  payload: {
    optionId: string;
    itemId: string;
    subOptionItems: SelectedOptionItem[];
  };
};

type SetOptionErrorsAction = {
  type: 'SET_OPTION_ERRORS';
  payload: {
    // OptionIDをキーにした、エラーメッセージのMap
    optionErrorsById: Record<string, string>;
  };
};

type InitializeAction = {
  type: 'INITIALIZE';
  payload: InitProps;
};

type ClearAction = {
  type: 'CLEAR';
};

export type Action =
  | ToggleOptionItemSelectionAction
  | ToggleOptionItemSelectionWithinOptionAction
  | AddOptionItemQuantityAction
  | SetSubOptionItemsAction
  | SetSubOptionItemsWithinOptionAction
  | SetOptionErrorsAction
  | InitializeAction
  | ClearAction;

/**
 * Reducer
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_OPTION_ITEM_SELECTION': {
      const oldItem = state.selectedOptionItems.byId[action.payload.itemId];
      return {
        ...state,
        // あったら削除、なかったら追加
        selectedOptionItems: oldItem
          ? removeOptionItem(state.selectedOptionItems, action.payload.itemId)
          : putOptionItem(state.selectedOptionItems, {
              optionId: action.payload.optionId,
              itemId: action.payload.itemId,
              quantity: 1,
              subOptionItems: [],
            }),
      };
    }
    case 'TOGGLE_OPTION_ITEM_SELECTION_WITHIN_OPTION': {
      const optionItems = selectSelectedOptionItemsByOptionId(state, action.payload.optionId);
      const isLastSelected = state.selectedOptionItems.byId[action.payload.itemId];
      const newSelectedItems = optionItems.reduce<SelectedOptionItems>((acc, item) => {
        return removeOptionItem(acc, item.itemId);
      }, state.selectedOptionItems);
      return {
        ...state,
        // 選択→選択解除の場合削除して終わり、そうでない場合は選択追加
        selectedOptionItems: isLastSelected
          ? newSelectedItems
          : putOptionItem(newSelectedItems, {
              optionId: action.payload.optionId,
              itemId: action.payload.itemId,
              quantity: 1,
              subOptionItems: [],
            }),
      };
    }
    case 'ADD_OPTION_ITEM_QUANTITY': {
      const oldItem = state.selectedOptionItems.byId[action.payload.itemId];
      const afterQuantity = (oldItem?.quantity ?? 0) + action.payload.amount;
      if (afterQuantity <= 0) {
        return {
          ...state,
          selectedOptionItems: removeOptionItem(state.selectedOptionItems, action.payload.itemId),
        };
      }
      return {
        ...state,
        selectedOptionItems: putOptionItem(state.selectedOptionItems, {
          optionId: action.payload.optionId,
          itemId: action.payload.itemId,
          quantity: afterQuantity,
          subOptionItems: oldItem?.subOptionItems ?? [],
        }),
      };
    }
    case 'SET_SUB_OPTION_ITEMS': {
      return {
        ...state,
        selectedOptionItems: putOptionItem(state.selectedOptionItems, {
          optionId: action.payload.optionId,
          itemId: action.payload.itemId,
          quantity: 1,
          subOptionItems: action.payload.subOptionItems,
        }),
      };
    }
    case 'SET_SUB_OPTION_ITEMS_WITHIN_OPTION': {
      // Option内で1つまでしか選択できないように、一旦全消ししてから追加する
      const oldItems = selectSelectedOptionItemsByOptionId(state, action.payload.optionId);
      const cleanedItems = oldItems.reduce<SelectedOptionItems>((acc, item) => {
        return removeOptionItem(acc, item.itemId);
      }, state.selectedOptionItems);
      return {
        ...state,
        selectedOptionItems: putOptionItem(cleanedItems, {
          optionId: action.payload.optionId,
          itemId: action.payload.itemId,
          quantity: 1,
          subOptionItems: action.payload.subOptionItems,
        }),
      };
    }
    case 'SET_OPTION_ERRORS': {
      return {
        ...state,
        optionErrorsById: action.payload.optionErrorsById,
      };
    }
    case 'INITIALIZE': {
      return init(action.payload);
    }
    case 'CLEAR': {
      return initialState;
    }
  }
};

const putOptionItem = (items: SelectedOptionItems, item: SelectedOptionItem): SelectedOptionItems => {
  const { ids, byId } = items;
  if (byId[item.itemId]) {
    // すでに存在する場合は上書き
    return {
      ids,
      byId: {
        ...byId,
        [item.itemId]: item,
      },
    };
  }
  return {
    ids: [...ids, item.itemId],
    byId: {
      ...byId,
      [item.itemId]: item,
    },
  };
};

const removeOptionItem = (items: SelectedOptionItems, itemId: string): SelectedOptionItems => {
  const { [itemId]: _, ...byId } = items.byId;
  return {
    ids: items.ids.filter((id) => id !== itemId),
    byId,
  };
};

/**
 * Selectors
 */

export const selectAllSelectedOptionItems = (state: State): SelectedOptionItem[] => {
  const { selectedOptionItems } = state;
  return selectedOptionItems.ids.map((id) => selectedOptionItems.byId[id]) as SelectedOptionItem[]; // ここはidsとbyIdの整合性が取れていることを前提とする
};

export const selectSelectedOptionItemsByOptionId = (state: State, optionId: string): SelectedOptionItem[] => {
  return selectAllSelectedOptionItems(state).filter((item) => item.optionId === optionId);
};

// OptionIDをキーにした、エラーメッセージのMapを返す
export const validateOptions = (state: State): Record<string, string> => {
  return Object.entries(state.optionRulesById).reduce<Record<string, string>>((result, [optionId, rule]) => {
    if (!rule) {
      throw new Error('implementation error: option rule is not found');
    }

    // Option内での選択数を計算
    const items = selectSelectedOptionItemsByOptionId(state, optionId);
    const error = validateSelectedOptionItems(rule, items);
    if (error) {
      result[optionId] = error;
    }

    return result;
  }, {});
};
