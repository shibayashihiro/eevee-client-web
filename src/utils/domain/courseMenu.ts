import { CourseMenuPricePerPerson } from '@/graphql/generated/types';

/**
 * コースメニューの価格は「¥1,000〜」のように範囲指定されることがあるため、それを解決する関数
 * @param price
 * @returns
 */
export function resolvePrice(price?: CourseMenuPricePerPerson | null): {
  price: number;
  priceExcludingTax: number;
} {
  if (!price) {
    return {
      price: 0,
      priceExcludingTax: 0,
    };
  }
  switch (price.__typename) {
    case 'CourseMenuFixedPricePerPerson':
      return {
        price: price.price,
        priceExcludingTax: price.priceExcludingTax,
      };

    case 'CourseMenuRangePricePerPerson':
      return {
        price: price.minPrice,
        priceExcludingTax: price.minPriceExcludingTax,
      };
  }
}
