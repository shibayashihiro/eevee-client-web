import { FC, useCallback, useMemo } from 'react';
import { Text } from '@chakra-ui/react';

import { useGlobalModalDialogDispatch, useGlobalModalDialogState } from '@/providers/tenant/GlobalModalDialogProvider';
import { ModalDialog } from '@/components/ui/ModalDialog';

const defaultCloseButtonText = '閉じる';

export const GlobalModalDialog: FC = () => {
  const { title, message, isShow, dialogOptions } = useGlobalModalDialogState();
  const { hide } = useGlobalModalDialogDispatch();

  const { closeButtonText, closeButtonVariant, onCloseCallback } = dialogOptions || {};

  const handleOnClose = useCallback(() => {
    hide();
    if (onCloseCallback) {
      onCloseCallback();
    }
  }, [hide, onCloseCallback]);

  const dialogAction = useMemo(
    () => ({
      text: closeButtonText || defaultCloseButtonText,
      onClick: handleOnClose,
    }),
    [closeButtonText, handleOnClose],
  );

  const isPrimary = closeButtonVariant === 'primary';

  return (
    <ModalDialog
      title={title}
      isOpen={isShow}
      onClose={handleOnClose}
      primaryAction={isPrimary ? dialogAction : undefined}
      secondaryAction={!isPrimary ? dialogAction : undefined}
      closeOnOverlayClick={false}
    >
      <Text>{message}</Text>
    </ModalDialog>
  );
};
