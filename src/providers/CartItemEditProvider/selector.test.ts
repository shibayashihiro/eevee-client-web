import { OrderType, TaxRateType } from '@/graphql/generated/types';

import { MenuItemForCartItemEditPartsFragment } from './CartItemEdit.fragment.generated';
import { State } from './reducer';
import { selectCurrentSubtotalPrice } from './selector';

test('selectCurrentSubtotalPrice', () => {
  const mockState: State = {
    menuItem: makeFragmentData({
      id: 'menu-item-01',
      price: 1000,
      taxRateType: TaxRateType.Normal,
      options: [
        makeMenuItemOptionFragmentData({
          id: 'option-01',
          items: [
            makeOptionItemFragmentData({
              price: 200,
              taxRateType: TaxRateType.Normal,
              id: 'option-item-200-yen',
              name: 'option-item-200-yen',
              subOptions: [
                makeSubOptionFragmentData({
                  id: 'sub-option-01',
                  items: [
                    makeSubOtpionItemFragmentData({
                      id: 'sub-option-item-300-yen',
                      name: 'sub-option-item-300-yen',
                      taxRateType: TaxRateType.Normal,
                      price: 300,
                    }),
                  ],
                }),
                makeSubOptionFragmentData({
                  id: 'sub-option-02',
                  items: [
                    makeSubOtpionItemFragmentData({
                      id: 'sub-option-item-400-yen',
                      name: 'sub-option-item-400-yen',
                      taxRateType: TaxRateType.Normal,
                      price: 400,
                    }),
                  ],
                }),
              ],
            }),
            makeOptionItemFragmentData({
              price: 500,
              taxRateType: TaxRateType.Reduced,
              id: 'option-item-500-yen',
              name: 'option-item-500-yen',
              subOptions: [
                makeSubOptionFragmentData({
                  id: 'sub-option-03',
                  items: [
                    makeSubOtpionItemFragmentData({
                      id: 'sub-option-item-600-yen',
                      name: 'sub-option-item-600-yen',
                      taxRateType: TaxRateType.Reduced,
                      price: 600,
                    }),
                  ],
                }),
                makeSubOptionFragmentData({
                  id: 'sub-option-04',
                  items: [
                    makeSubOtpionItemFragmentData({
                      id: 'sub-option-item-700-yen',
                      name: 'sub-option-item-700-yen',
                      taxRateType: TaxRateType.Reduced,
                      price: 700,
                    }),
                  ],
                }),
              ],
            }),
            makeOptionItemFragmentData({
              price: 1200,
              taxRateType: TaxRateType.Reduced,
              id: 'option-item-no-selected',
              name: 'no selected optionitem',
              subOptions: [],
            }),
          ],
        }),
      ],
    }),
    quantity: 2,
    options: {
      selectedOptionItems: {
        ids: ['option-item-200-yen', 'option-item-500-yen'],
        byId: {
          'option-item-200-yen': {
            optionId: 'option-01',
            itemId: 'option-item-200-yen',
            quantity: 2,
            subOptionItems: [
              {
                optionId: 'sub-option-01',
                itemId: 'sub-option-item-300-yen',
                quantity: 2,
                subOptionItems: [],
              },
              {
                optionId: 'sub-option-02',
                itemId: 'sub-option-item-400-yen',
                quantity: 3,
                subOptionItems: [],
              },
            ],
          },
          'option-item-500-yen': {
            optionId: 'option-01',
            itemId: 'option-item-500-yen',
            quantity: 1,
            subOptionItems: [
              {
                optionId: 'sub-option-03',
                itemId: 'sub-option-item-600-yen',
                quantity: 4,
                subOptionItems: [],
              },
            ],
          },
        },
      },
      optionRulesById: {},
      optionErrorsById: {},
    },
  };

  const { subtotalPrice, subtotalPriceExcludingTax } = selectCurrentSubtotalPrice(mockState, OrderType.Takeout);
  // 2 * (1000 + (2 * (200 + (2 * 300) + (3 * 400)) + 1 * (500 + 4 * 600)))
  expect(subtotalPrice).toBe(15800);
  expect(subtotalPriceExcludingTax).toBe(14462);
});

/**
 * テスト用のFragment Type定義
 *
 * GraphQLをアップデートできるとこの辺りを自分で書かなくて良くなりそう
 */
type MenuItemOptionFragment = MenuItemForCartItemEditPartsFragment['options'][0];
type OptionItemFragment = MenuItemOptionFragment['items'][0];
type SubOptionFragment = OptionItemFragment['subOptions'][0];
type SubOptionItemFragment = SubOptionFragment['items'][0];

type OmitTypeName<T> = Omit<T, '__typename'>;

const makeFragmentData = (
  data: OmitTypeName<MenuItemForCartItemEditPartsFragment>,
): MenuItemForCartItemEditPartsFragment => {
  return {
    __typename: 'MenuItem',
    ...data,
  };
};
const makeMenuItemOptionFragmentData = (data: OmitTypeName<MenuItemOptionFragment>): MenuItemOptionFragment => {
  return {
    __typename: 'MenuItemOption',
    ...data,
  };
};
const makeOptionItemFragmentData = (data: OmitTypeName<OptionItemFragment>): OptionItemFragment => {
  return {
    __typename: 'OptionItem',
    ...data,
  };
};
const makeSubOptionFragmentData = (data: OmitTypeName<SubOptionFragment>): SubOptionFragment => {
  return {
    __typename: 'MenuItemOption',
    ...data,
  };
};
const makeSubOtpionItemFragmentData = (data: OmitTypeName<SubOptionItemFragment>): SubOptionItemFragment => {
  return {
    __typename: 'OptionItem',
    ...data,
  };
};
