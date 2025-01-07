import React, { FC } from 'react';
import { Center, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';

import { PaymentItemPartsFragment } from '@/components/domain/PaymentItem/PaymentItem.fragment.generated';
import { PaymentType } from '@/graphql/generated/types';
import { YenIcon } from '@/components/ui/Icons/YenIcon';

type Props = {
  fragment: PaymentItemPartsFragment;
};

export const PaymentItem: FC<Props> = ({ fragment: { name, paymentType, brand, isSelected, isSignInRequired } }) => {
  return (
    <HStack display="inline-flex" spacing="8px">
      <PaymentIcon paymentType={paymentType} brand={brand} />
      <VStack align="start" spacing={0}>
        <Text className="bold-small" color={isSelected ? 'brand.primaryText' : ''}>
          {name}
        </Text>
        {isSignInRequired && (
          <Text textStyle="bold-micro" color="mono.secondary">{`${name}をするにはログインが必要です`}</Text>
        )}
      </VStack>
    </HStack>
  );
};

const PaymentIcon = ({ paymentType, brand }: { paymentType: PaymentType; brand: string }) => {
  switch (paymentType) {
    case PaymentType.Card:
      return <CardIcon brand={brand} />;
    case PaymentType.Register:
      return <OfflinePaymentIcon />;
    default:
      return null;
  }
};

const CardIcon = ({ brand }: { brand: string }) => {
  const src = cardImage(brand);
  if (!src) {
    return null;
  }
  return <Image src={src} h="26px" alt={brand} />;
};

const cardImage = (brand: string) => {
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
      return null;
  }
};

const OfflinePaymentIcon = () => {
  return (
    <Center border="1px" borderColor="mono.divider" borderRadius="4px" minWidth="42px" height="26px">
      <Icon as={YenIcon} boxSize="16.67px" />
    </Center>
  );
};
