import { formatPrice } from '../formatUtils';

export const menuItemOptionInputTypes = {
  radio: 'radio',
  checkbox: 'checkbox',
  number: 'number',
} as const;

export type MenuItemOptionInputType = keyof typeof menuItemOptionInputTypes;

export const resolveMenuItemOptionInputType = ({
  minSelectCount,
  maxSelectCount,
  maxSelectCountPerItem,
}: {
  minSelectCount?: number | null;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
}): MenuItemOptionInputType => {
  const isRequired = minSelectCount && minSelectCount > 0;
  const allowMultiple = maxSelectCount && maxSelectCount > 1;
  // 各1個までかどうか
  const maxSelectCountPerItemIsSingle = maxSelectCountPerItem && maxSelectCountPerItem === 1;

  if (
    (isRequired && !allowMultiple) ||
    maxSelectCount ===
      1 /* 最大1個の場合はradioにする(requiredでないならradioよりcheckboxの方が良さそうだが、eevee-clientアプリのUIと統一してradio) */
  ) {
    return menuItemOptionInputTypes.radio;
  }

  if (maxSelectCountPerItemIsSingle) {
    return menuItemOptionInputTypes.checkbox;
  }

  return menuItemOptionInputTypes.number;
};

export type MenuOptionInputRule = {
  optionId: string;
  minSelectCount?: number;
  maxSelectCount?: number;
  maxSelectCountPerItem?: number;
};

// OptionItemの選択状態を保持するために使う
export type SelectedOptionItem = {
  optionId: string;
  itemId: string;
  quantity: number;

  subOptionItems: SelectedOptionItem[];
};

// エラーがあればエラーメッセージを返す
export const validateSelectedOptionItems = (
  rule: MenuOptionInputRule,
  selectedOptionItems: SelectedOptionItem[],
): string | null => {
  const { optionId, minSelectCount, maxSelectCount, maxSelectCountPerItem } = rule;

  const isRequired = minSelectCount && minSelectCount > 0;
  const prefix = isRequired ? '必須・' : '任意・';

  const sumSelectedCount = selectedOptionItems.reduce<number>((sum, item) => {
    if (item.optionId === optionId) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  if (minSelectCount && sumSelectedCount < minSelectCount) {
    return `${prefix}${rule.minSelectCount}点以上選択してください`;
  }
  if (maxSelectCount && sumSelectedCount > maxSelectCount) {
    return `${prefix}${maxSelectCount}点以下で選択してください`;
  }

  if (maxSelectCountPerItem) {
    const overLimitItem = selectedOptionItems.find((item) => {
      return item.optionId === optionId && item.quantity > maxSelectCountPerItem;
    });
    if (overLimitItem) {
      return `${prefix}${overLimitItem.quantity}点以下で選択してください`;
    }
  }

  return null;
};

export const formatOptionItemPrice = (price: number): string => {
  const sign = price > 0 ? '+' : '';
  return `${sign}${formatPrice(price)}`;
};
