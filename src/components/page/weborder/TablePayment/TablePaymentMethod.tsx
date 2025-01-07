import { Box, Text, Image, HStack, Spacer, Link } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';

import variables from '@/styles/variables.module.scss';
import { PaymentItem } from '@/components/domain/PaymentItem';
import { PaymentDialog } from '@/components/domain/PaymentDialog';
import { PaymentDialogPartsFragment } from '@/components/domain/PaymentDialog/PaymentDialog.fragment.generated';

type Props = {
  payments: PaymentDialogPartsFragment[];
};

export const TablePaymentMethod = ({ payments }: Props) => {
  const paymentDialogState = useDisclosure();
  const selectedPaymentMethod = payments.find((p) => p.isSelected);
  return (
    <>
      <Box mt="8px" mb="16px" width="full">
        <PaymentDialog isOpen={paymentDialogState.isOpen} onClose={paymentDialogState.onClose} fragment={payments} />
        <Text
          className="bold-extra-small"
          pb="8px"
          color={variables.monoSecondary}
          borderBottom="1px"
          borderColor={variables.monoBackGround}
        >
          お支払い方法
          <Image
            src="/assets/card_brands.png"
            alt="対応クレジットカード：VISA、Mastercard、アメリカン・エキスプレス、JCB、ダイナース、ディスカバー"
            h="24px"
            mt="8px"
          />
        </Text>
        <HStack pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
          {selectedPaymentMethod ? (
            <PaymentItem fragment={selectedPaymentMethod} />
          ) : (
            <Text className="bold-small">未設定</Text>
          )}
          <Spacer />
          <Link onClick={paymentDialogState.onOpen}>
            <Text className="text-small" color="brand.primaryText">
              変更する
            </Text>
          </Link>
        </HStack>
      </Box>
    </>
  );
};
