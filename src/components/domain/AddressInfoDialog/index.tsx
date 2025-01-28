import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddressInfoDialog: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <ModalDialog
      title="表示される住所情報が異なる場合"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
      primaryAction={{
        text: 'OK',
        height: '56px',
        onClick: onClose,
      }}
    >
      <Text className="text-small" textAlign="start" fontWeight="400">
        マップ上でお届け先住所にピンを指定し、正しい住所情報は「配達時の注意点メモ」にご記入ください
      </Text>
    </ModalDialog>
  );
};
