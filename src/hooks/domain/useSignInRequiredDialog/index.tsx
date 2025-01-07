import { useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { SignInRequiredDialog } from './SignInRequiredDialog';

type SignInRequiredDialogOptions = {
  backTo?: string;
};

/**
 * useSignInRequiredDialog は、ログインが必要なことを示すダイアログ表示を提供するhooksです。
 * @param { SignInRequiredDialogOptions } options - ダイアログに渡すパラメータ
 * @param { string } options.backTo - ログイン後の遷移先パス
 */
export const useSignInRequiredDialog = (options?: SignInRequiredDialogOptions) => {
  const router = useTenantRouter();
  const [title, setTitle] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnOpen = useCallback(
    (dialogTitle: string) => {
      setTitle(dialogTitle);
      onOpen();
    },
    [onOpen],
  );

  const backTo = options?.backTo || router.asPath;

  const renderDialog = useCallback(() => {
    return <SignInRequiredDialog title={title} backTo={backTo} isOpen={isOpen} onClose={onClose} />;
  }, [isOpen, onClose, title, backTo]);

  return { onOpen: handleOnOpen, onClose, renderDialog };
};
