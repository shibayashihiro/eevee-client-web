import React, { FC } from 'react';
import { Box, Flex, HStack, Text, Icon, useDisclosure } from '@chakra-ui/react';
import PhoneIcon from '@mui/icons-material/Phone';

import variables from '@/styles/variables.module.scss';
import { ContactType } from '@/graphql/generated/types';
import { PhoneCallConfirmDialog } from '@/components/domain/PhoneCallConfirmDialog';
import { DeliveryOrderProgressDetailPartsFragment } from '@/components/domain/DeliveryOrderProgressDetail/DeliveryOrderProgressDetail.fragment.generated';
import { OrderProgressStatus } from '@/components/domain/OrderProgressStatus';

const contactTitles: Record<ContactType, string> = {
  [ContactType.Shop]: '注文について店舗に問い合わせる',
  [ContactType.Support]: 'Chompyサポートチームに問い合わせる',
};

const phoneCallConfirmDescriptions: Record<ContactType, string> = {
  [ContactType.Shop]: '店舗に直接話しますか?',
  [ContactType.Support]: 'Chompyサポートチームに直接話しますか?',
};

type Props = {
  fragment: DeliveryOrderProgressDetailPartsFragment;
};

export const DeliveryOrderProgressDetail: FC<Props> = ({ fragment }: Props) => {
  const phoneCallConfirmDialogState = useDisclosure();

  return (
    <>
      <PhoneCallConfirmDialog
        isOpen={phoneCallConfirmDialogState.isOpen}
        onClose={phoneCallConfirmDialogState.onClose}
        title={phoneCallConfirmDescriptions[fragment.contactType]}
        tel={fragment.tel}
      />
      <Box pt="40px">
        <Text className="bold-extra-small" color={variables.monoSecondary}>
          お届け時間の目安
        </Text>
        <HStack>
          <Text className="bold-32px">{fragment.scheduledTime}</Text>
          <Text className="bold-small">までにお届け予定です</Text>
        </HStack>

        <OrderProgressStatus
          lastStep={fragment.lastStep}
          currentStep={fragment.currentStep}
          stepSubject={fragment.stepSubject}
          caution={''}
        />

        <Flex justifyContent="end" direction="row" w="full" pt="12px" onClick={phoneCallConfirmDialogState.onOpen}>
          <Icon as={PhoneIcon} color="brand.primaryText" w="18px" h="18px" />
          <Text color="brand.primaryText" className="text-extra-small" ml="6px">
            {contactTitles[fragment.contactType]}
          </Text>
        </Flex>
      </Box>
    </>
  );
};
