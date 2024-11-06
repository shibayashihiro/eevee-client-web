import { Box, Text, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import { FC } from 'react';
import PhoneIcon from '@mui/icons-material/Phone';

import { TakeoutOrderProgressDetailPartsFragment } from '@/components/domain/TakeoutOrderProgressDetail/TakeoutOrderProgressDetail.fragment.generated';
import variables from '@/styles/variables.module.scss';
import { OrderProgressStatus } from '@/components/domain/OrderProgressStatus';
import { PhoneCallConfirmDialog } from '@/components/domain/PhoneCallConfirmDialog';
import { useReceiveTakeoutOrderMutation } from '@/components/domain/TakeoutOrderProgressDetail/TakeoutOrderProgressDetail.mutation.generated';
import { PrimaryButton } from '@/components/ui/Button';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { generateMutationId } from '@/graphql/helper';
import { OrderReceivedConfirmDialog } from '@/components/domain/OrderReceivedConfirmDialog';

type Props = {
  fragment: TakeoutOrderProgressDetailPartsFragment;
  shortIds: string[];
  orderId: string;
};

export const TakeoutOrderProgressDetail: FC<Props> = ({ fragment, shortIds, orderId }) => {
  const phoneCallConfirmDialogState = useDisclosure();
  const receivedConfirmDialogState = useDisclosure();

  const [result, receive] = useReceiveTakeoutOrderMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleOnClick = async () => {
    await receivedConfirmDialogState.onClose();

    const { error } = await receive({
      input: {
        clientMutationId: generateMutationId(),
        orderId: orderId,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
  };
  const { fetching } = result;
  useLoadingOverlay(fetching);

  return (
    <>
      <PhoneCallConfirmDialog
        isOpen={phoneCallConfirmDialogState.isOpen}
        onClose={phoneCallConfirmDialogState.onClose}
        title={'店舗に直接話しますか?'}
        tel={fragment.tel}
      />
      <OrderReceivedConfirmDialog
        isOpen={receivedConfirmDialogState.isOpen}
        onClose={receivedConfirmDialogState.onClose}
        handleOnClick={handleOnClick}
      />
      <Box pt="40px">
        <Text className="bold-extra-small" color={variables.monoSecondary}>
          受け取り時間
        </Text>
        <Text className="bold-32px">{fragment.scheduledTime}</Text>

        <Text className="bold-extra-small" color={variables.monoSecondary}>
          受け取り番号
        </Text>
        <Text className="bold-32px" mb="8px">
          {shortIds.join(', ')}
        </Text>

        <OrderProgressStatus
          lastStep={fragment.lastStep}
          currentStep={fragment.currentStep}
          stepSubject={fragment.stepSubject}
          caution={fragment.caution}
        />

        {fragment.prepared && (
          <PrimaryButton onClick={receivedConfirmDialogState.onOpen} mt="24px" mb="24px">
            商品の受け取り完了
          </PrimaryButton>
        )}

        <Flex justifyContent="end" direction="row" w="full" pt="12px" onClick={phoneCallConfirmDialogState.onOpen}>
          <Icon as={PhoneIcon} color="brand.primaryText" w="18px" h="18px" />
          <Text color="brand.primaryText" className="text-extra-small" ml="6px">
            注文について店舗に問い合わせる
          </Text>
        </Flex>
      </Box>
    </>
  );
};
