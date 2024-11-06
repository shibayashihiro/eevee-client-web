import { TaxRateType } from '@/graphql/generated/types';

import { getPriceExcludingTax, taxRoundTypes } from './tax';

test.each([
  [TaxRateType.Reduced, 1000, taxRoundTypes.RoundFloor, 926],
  [TaxRateType.Normal, 6818, taxRoundTypes.RoundFloor, 6199],
  [TaxRateType.Normal, 3298, taxRoundTypes.RoundFloor, 2999],
  [TaxRateType.Normal, 1648, taxRoundTypes.RoundFloor, 1499],
  [TaxRateType.Normal, 658, taxRoundTypes.RoundFloor, 599],
  [TaxRateType.Normal, 4398, taxRoundTypes.RoundFloor, 3999],
  [TaxRateType.Normal, 2198, taxRoundTypes.RoundFloor, 1999],
])('test getPriceExcludingTax', (taxRate, targetPriceIncludingTax, roundType, expected) => {
  expect(getPriceExcludingTax(taxRate, targetPriceIncludingTax, roundType)).toBe(expected);
});
