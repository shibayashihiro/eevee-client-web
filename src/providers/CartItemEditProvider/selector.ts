import { OrderType, TaxRateType } from '@/graphql/generated/types';
import { SelectedOptionItem } from '@/utils/domain/menuItemOption';
import { getFinalTaxRateType, getTaxInclude, taxRoundTypes } from '@/utils/domain/tax';

import { State } from './reducer';

export const selectSelectedOptionItem = (state: State, itemId: string): SelectedOptionItem | null => {
  const item = state.options.selectedOptionItems.byId[itemId];
  if (!item) {
    return null;
  }
  return item;
};

// 小計を「標準税率対象金額」と「軽減税率対象金額」に分けて計算して返す。
const selectCalculateSubtotalPrices = (
  state: State,
  orderType: OrderType,
): {
  normalTaxRateSubtotal: number;
  reducedTaxRateSubtotal: number;
} => {
  let normalTaxRateSubtotal = 0;
  let reducedTaxRateSubtotal = 0;
  const {
    menuItem,
    quantity: menuItemQuantity,
    options: { selectedOptionItems },
  } = state;
  // 商品の金額の足し込み
  switch (getFinalTaxRateType(menuItem.taxRateType, orderType)) {
    case TaxRateType.Normal:
      normalTaxRateSubtotal += menuItem.price * menuItemQuantity;
      break;
    case TaxRateType.Reduced:
      reducedTaxRateSubtotal += menuItem.price * menuItemQuantity;
      break;
  }
  menuItem.options.forEach((option) => {
    option.items.forEach((item) => {
      const selectedOptionItem = selectedOptionItems.byId[item.id];
      if (!selectedOptionItem) {
        return; // continue
      }
      const optionItemQuantity = selectedOptionItem.quantity * menuItemQuantity;
      // 商品オプション金額の足し込み
      const itemPrice = (item.price ?? 0) * optionItemQuantity;
      switch (getFinalTaxRateType(item.taxRateType, orderType)) {
        case TaxRateType.Normal:
          normalTaxRateSubtotal += itemPrice;
          break;
        case TaxRateType.Reduced:
          reducedTaxRateSubtotal += itemPrice;
          break;
      }
      // 商品オプションの、サブオプション金額の足し込み
      item.subOptions.forEach((subOption) => {
        subOption.items.forEach((subOptionItem) => {
          const selectedSubOptionItem = selectedOptionItem.subOptionItems.find((i) => i.itemId === subOptionItem.id);
          if (!selectedSubOptionItem) {
            return; // continue
          }
          const subOptionItemPrice = (subOptionItem.price ?? 0) * selectedSubOptionItem.quantity * optionItemQuantity;
          switch (getFinalTaxRateType(subOptionItem.taxRateType, orderType)) {
            case TaxRateType.Normal:
              normalTaxRateSubtotal += subOptionItemPrice;
              break;
            case TaxRateType.Reduced:
              reducedTaxRateSubtotal += subOptionItemPrice;
              break;
          }
        });
      });
    });
  });
  return {
    normalTaxRateSubtotal,
    reducedTaxRateSubtotal,
  };
};

/**
 * state から現在の小計金額(税込)と、税抜き小計金額を取得する。
 * ※税抜き金額はあくまで表示用
 */
export const selectCurrentSubtotalPrice = (
  state: State,
  orderType: OrderType,
): {
  subtotalPrice: number;
  subtotalPriceExcludingTax: number;
} => {
  const { normalTaxRateSubtotal, reducedTaxRateSubtotal } = selectCalculateSubtotalPrices(state, orderType);
  const subtotalPrice = normalTaxRateSubtotal + reducedTaxRateSubtotal;
  const normalTax = getTaxInclude(TaxRateType.Normal, normalTaxRateSubtotal, taxRoundTypes.RoundFloor);
  const reducedTax = getTaxInclude(TaxRateType.Reduced, reducedTaxRateSubtotal, taxRoundTypes.RoundFloor);
  return {
    subtotalPrice,
    subtotalPriceExcludingTax: subtotalPrice - normalTax - reducedTax,
  };
};

export const selectSelectedSubOptionItems = (state: State, optionItemId: string, optionId: string) => {
  const selectedItem = selectSelectedOptionItem(state, optionItemId);
  if (!selectedItem) {
    return [];
  }
  return selectedItem.subOptionItems.filter((i) => i.optionId === optionId);
};
