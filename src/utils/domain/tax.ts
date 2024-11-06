/**
 * 税計算に関するユーティリティ。
 * 基本的にはサーバーで計算をおこないたいが、一部Client側でシームレスに計算しないといけない箇所で利用する。
 * (例: カート内の商品の数量変更時など。)
 */
import { OrderType, TaxRateType } from '@/graphql/generated/types';

// 税率(%。例: 10% => 10)
const taxRateInPercent: Record<TaxRateType, number> = {
  [TaxRateType.Normal]: 10,
  [TaxRateType.Reduced]: 8,
};

export const taxRoundTypes = {
  // 切り捨て
  RoundFloor: 'floor',
  // TODO: 現状は切り捨てのみサポート。(切り捨て以外をサポートする場合はどの道色々な箇所を修正する必要があるため見送り)
} as const;
export type TaxRoundType = (typeof taxRoundTypes)[keyof typeof taxRoundTypes];

/**
 * 内税を計算して返す
 */
export const getTaxInclude = (
  taxRate: TaxRateType,
  targetPriceIncludingTax: number,
  roundType: TaxRoundType,
): number => {
  const taxRateValue = taxRateInPercent[taxRate];
  const tax = (targetPriceIncludingTax * taxRateValue) / (100 + taxRateValue);
  switch (roundType) {
    case taxRoundTypes.RoundFloor:
      return Math.floor(tax);
    default:
      throw new Error(`Unsupported roundType: ${roundType}`);
  }
};

/**
 * 税込価格から、税抜き価格を計算して返す
 */
export const getPriceExcludingTax = (
  taxType: TaxRateType,
  targetPriceIncludingTax: number,
  roundType: TaxRoundType,
): number => {
  const tax = getTaxInclude(taxType, targetPriceIncludingTax, roundType);
  return targetPriceIncludingTax - tax;
};

/**
 * orderTypeも考慮して最終的な税率種別を取得する
 */
export const getFinalTaxRateType = (taxType: TaxRateType, orderType: OrderType): TaxRateType => {
  if (orderType === OrderType.EatIn) {
    return TaxRateType.Normal;
  }
  return taxType;
};
