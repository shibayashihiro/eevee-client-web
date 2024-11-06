import React, { FC } from 'react';
import { Image, Text } from '@chakra-ui/react';

import { PaymentItemPartsFragment } from '@/components/domain/PaymentItem/PaymentItem.fragment.generated';
import { PaymentType } from '@/graphql/generated/types';

type Props = {
  fragment: PaymentItemPartsFragment;
};

export const PaymentItem: FC<Props> = ({ fragment }) => {
  const paymentIcon = (paymentType: PaymentType, brand: string) => {
    switch (paymentType) {
      case PaymentType.Card:
        switch (brand) {
          case 'Visa':
            return '/assets/visa.png';
          case 'MasterCard':
            return '/assets/mastercard.png';
          case 'American Express':
            return '/assets/amex.png';
          case 'Diners Club':
            return '/assets/diners.png';
          case 'Discover':
            return '/assets/discover.png';
          case 'JCB':
            return '/assets/jcb.png';
          case 'UnionPay':
            return '/assets/unionpay.png';
          default:
            return '';
        }
      case PaymentType.Register:
        return '/assets/register.png';
      default:
        return '';
    }
  };

  const paymentName = (paymentType: PaymentType, last4: string) => {
    switch (paymentType) {
      case PaymentType.Card:
        return `**** ${last4}`;
      case PaymentType.Register:
        return 'レジ決済';
      default:
        return '';
    }
  };

  return (
    <>
      <Image src={paymentIcon(fragment.paymentType, fragment.brand)} h="26px" alt="PaymentIcon" />
      <Text className="bold-small" color={fragment.isSelected ? 'brand.primaryText' : ''}>
        {paymentName(fragment.paymentType, fragment.last4)}
      </Text>
    </>
  );
};
