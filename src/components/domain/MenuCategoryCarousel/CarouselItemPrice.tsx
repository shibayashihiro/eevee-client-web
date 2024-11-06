import React from 'react';
import { HStack, Text, VStack } from '@chakra-ui/react';

import { formatPrice } from '@/utils/formatUtils';

type Props = {
  price: number;
  priceExcludingTax?: number;
  // 「¥1,000〜」のように範囲を表示する場合に指定する
  asRange?: boolean;
  // 売り切れなどの文言を、表示する時のみ指定する
  unavailableReason?: string | null;
};

export const CarouselItemPrice = ({ price, priceExcludingTax, asRange, unavailableReason }: Props) => {
  const showUnavailableLabel = unavailableReason !== null && unavailableReason !== undefined;
  const priceSuffix = asRange ? '〜' : '';

  const hasPriceExcludingTax = priceExcludingTax !== undefined;
  return (
    <VStack align="start" spacing={0}>
      <HStack className="bold-small mono-secondary">
        <Text as={showUnavailableLabel ? 'del' : undefined}>{`${formatPrice(
          hasPriceExcludingTax ? priceExcludingTax : price,
        )}${priceSuffix}`}</Text>
        {showUnavailableLabel && <Text>{unavailableReason}</Text>}
      </HStack>
      {hasPriceExcludingTax && (
        <Text as={showUnavailableLabel ? 'del' : undefined} className="text-micro mono-secondary">
          {`(税込${formatPrice(price)})`}
        </Text>
      )}
    </VStack>
  );
};
