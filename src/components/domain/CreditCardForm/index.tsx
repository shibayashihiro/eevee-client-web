import React from 'react';
import { Center, Image } from '@chakra-ui/react';

import { StripeCreditCardForm } from '@/components/domain/CreditCardForm/StripeCreditCardForm';
import { StripeProvider } from '@/utils/stripe/provider';

export const CreditCardForm = () => {
  return (
    <>
      <Center mb="24px">
        <Image
          src="/assets/card_brands.png"
          alt="対応クレジットカード：VISA、Mastercard、アメリカン・エキスプレス、JCB、ダイナース、ディスカバー"
          h="24px"
        />
      </Center>
      <StripeProvider>
        <StripeCreditCardForm />
      </StripeProvider>
    </>
  );
};
