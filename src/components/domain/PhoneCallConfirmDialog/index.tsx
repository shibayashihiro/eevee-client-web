import { FC } from 'react';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { ModalDialog } from '@/components/ui/ModalDialog';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tel: string;
  title: string;
};

export const PhoneCallConfirmDialog: FC<Props> = ({ isOpen, onClose, tel, title }) => {
  const router = useRouter();

  const handleOnClick = async () => {
    await router.push(`tel://${tel}`);
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primaryAction={{
        text: '電話する',
        onClick: handleOnClick,
      }}
      secondaryAction={{
        text: '閉じる',
        onClick: onClose,
      }}
    >
      <Text className="text-small">電話番号: {tel}</Text>
    </ModalDialog>
  );
};
