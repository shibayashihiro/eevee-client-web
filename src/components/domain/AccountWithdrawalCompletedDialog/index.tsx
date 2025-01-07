import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const AccountWithdrawalCompletedDialog: FC<Props> = ({ isOpen, onClose }) => {
  const closeAction = {
    text: '閉じる',
    onClick: onClose,
  };
  return (
    <ModalDialog
      title="退会が完了しました"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      secondaryAction={closeAction}
    >
      <Text className="text-small">ご利用ありがとうございました。</Text>
    </ModalDialog>
  );
};
