import React, { FC, useCallback, useState } from 'react';
import { Box, Link, OrderedList, Text, useDisclosure, VStack } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { PaymentDialogPartsFragment } from '@/components/domain/PaymentDialog/PaymentDialog.fragment.generated';
import variables from '@/styles/variables.module.scss';
import { useUpdateDefaultPaymentMutation } from '@/components/domain/PaymentDialog/PaymentDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { PaymentDeleteDialog } from '@/components/domain/PaymentDialog/PaymentDeleteDialog';
import { PaymentListItem } from '@/components/domain/PaymentDialog/PaymentListItem';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { creditCardAddPage } from '@/utils/paths/tenantPages';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { PaymentType } from '@/graphql/generated/types';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useSignInRequiredDialog } from '@/hooks/domain/useSignInRequiredDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fragment: PaymentDialogPartsFragment[];
};

export const usePaymentDeleteDialogState = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (id: string) => {
      setSelectedId(id);
      onOpen();
    },
    [onOpen],
  );

  return {
    selectedId,
    isOpen,
    onOpen: handleOpen,
    onClose,
  };
};

export const PaymentDialog: FC<Props> = ({ isOpen, onClose, fragment }) => {
  const { isAnonymous } = useAuthUser();
  const router = useTenantRouter();

  const deleteDialogState = usePaymentDeleteDialogState();
  const [updateDefaultResult, updateDefault] = useUpdateDefaultPaymentMutation();

  const { renderDialog: renderSignInRequiredDialog, onOpen: openSignInRequiredDialog } = useSignInRequiredDialog();

  const handleOnClickAddCreditCard = useCallback(async () => {
    await router.push(creditCardAddPage);
  }, [router]);

  const handleOnClickUpdateSelect = async (item: PaymentDialogPartsFragment) => {
    if (item.isSelected) return;

    if (item.isSignInRequired && isAnonymous) {
      openSignInRequiredDialog(`${item.name}をするにはログインが必要です`);
      return;
    }

    await updateDefault({
      input: {
        clientMutationId: generateMutationId(),
        paymentId: item.id,
      },
    });
    onClose();
  };

  const { fetching, error } = updateDefaultResult;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  const creditCardList = fragment.filter((item) => item.paymentType === PaymentType.Card);
  const registerPayment = fragment.find((item) => item.paymentType === PaymentType.Register);

  return (
    <>
      <PaymentDeleteDialog
        isOpen={deleteDialogState.isOpen}
        onClose={deleteDialogState.onClose}
        itemId={deleteDialogState.selectedId}
      />
      <ModalDialog
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{
          text: '閉じる',
          onClick: onClose,
        }}
      >
        <VStack align="start" spacing="0">
          <Text
            className="bold-extra-small"
            mt="0"
            pb="8px"
            w="full"
            color={variables.monoSecondary}
            borderBottom="1px"
            borderColor={variables.monoBackGround}
          >
            クレジットカード
          </Text>
          {creditCardList.length > 0 && (
            <>
              <Box my="0" w="full">
                <OrderedList styleType="none" marginStart="0px">
                  {creditCardList.map((item) => (
                    <React.Fragment key={item.id}>
                      <PaymentListItem
                        fragment={item}
                        onClick={() => handleOnClickUpdateSelect(item)}
                        onLeftSwipeDelete={deleteDialogState.onOpen}
                      />
                    </React.Fragment>
                  ))}
                </OrderedList>
              </Box>
            </>
          )}
          <Link onClick={handleOnClickAddCreditCard} w="full">
            <Text pt="16px" pb="16px" className="bold-small" borderBottom="1px" borderColor={variables.monoBackGround}>
              クレジットカードを新しく追加する
            </Text>
          </Link>
        </VStack>
        {registerPayment && (
          <VStack align="start" spacing="0">
            <Text
              className="bold-extra-small"
              mt="32px"
              pb="8px"
              w="full"
              color={variables.monoSecondary}
              borderBottom="1px"
              borderColor={variables.monoBackGround}
            >
              その他の支払い方法
            </Text>
            <Box mt="0" mb="16px" w="full">
              <OrderedList styleType="none" marginStart="0px">
                <React.Fragment key={registerPayment.id}>
                  <PaymentListItem
                    fragment={registerPayment}
                    onClick={() => handleOnClickUpdateSelect(registerPayment)}
                    onLeftSwipeDelete={deleteDialogState.onOpen}
                  />
                </React.Fragment>
              </OrderedList>
            </Box>
          </VStack>
        )}
      </ModalDialog>
      {renderSignInRequiredDialog()}
    </>
  );
};
