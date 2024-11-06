import { FC } from 'react';
import { Text } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleOnClick: () => void;
};

export const OrderReceivedConfirmDialog: FC<Props> = ({ isOpen, onClose, handleOnClick }) => {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      primaryAction={{
        text: 'OK',
        onClick: handleOnClick,
      }}
      secondaryAction={{
        text: 'キャンセル',
        onClick: onClose,
      }}
      title="商品を受け取りましたか？"
    >
      <Text className="text-small">お店で商品の受け取りが完了してからOKを押してください。</Text>
    </ModalDialog>
  );
};
