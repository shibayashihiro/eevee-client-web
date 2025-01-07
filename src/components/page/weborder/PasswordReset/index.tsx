import { VStack, Text, FormControl, Box, useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { InputWithLabel } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useTenantRouter, useUsingOriginalIdProvider } from '@/providers/tenant/WebOrderPageStateProvider';
import variables from '@/styles/variables.module.scss';
import { containerMarginX } from '@/utils/constants';
import {
  useGlobalLoadingSpinnerDispatch,
  useGlobalLoadingSpinnerState,
} from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuth } from '@/auth/provider/AuthProvider';

const PasswordResetPage: NextPageWithLayout = () => {
  const { sendPasswordResetEmail } = useAuth();
  const router = useTenantRouter();
  const { showAlertDialog } = useShowAlertDialog();
  const usingOriginalIdProvider = useUsingOriginalIdProvider();

  const [email, setEmail] = useState('');
  const loading = useGlobalLoadingSpinnerState();
  const setLoading = useGlobalLoadingSpinnerDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitButtonEnabled = email.length > 0 && !loading;

  const handleClickBackIcon = useCallback(() => {
    router.back();
  }, [router]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleClickSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const err = await sendPasswordResetEmail(email);
      if (err) {
        showAlertDialog(err.message);
      }
    } finally {
      setLoading(false);
    }
    onOpen();
  }, [email, onOpen, sendPasswordResetEmail, setLoading, showAlertDialog]);

  const handleCloseConfirmDialog = useCallback(() => {
    onClose();
    router.back();
  }, [onClose, router]);

  return (
    <>
      <InsideNavbar title="パスワード再設定" onClickBackIcon={handleClickBackIcon} />
      <VStack mx="auto" pt="24px" px={containerMarginX} pb="32px" spacing="16px" maxW={variables.containerMaxWidth}>
        <Text w="full" className="bold-small">
          パスワードの再設定手続きのご案内を送信します
        </Text>
        <FormControl>
          <VStack spacing="24px">
            <Box w="full">
              <InputWithLabel
                id="email"
                label="メールアドレス"
                placeholder="mail@example.com"
                value={email}
                onChange={handleChangeEmail}
              />
            </Box>
          </VStack>
        </FormControl>
        {!usingOriginalIdProvider && (
          <Text w="full" className="text-extra-small">
            当アプリをサポートしているChompy(チョンピー)がメールをお送りします。chompy.jp
            からのメールを受信できるよう設定のご確認をお願いいたします。
          </Text>
        )}
        <Box w="full" pt="34px">
          <PrimaryButton h="56px" disabled={!submitButtonEnabled} onClick={handleClickSubmit}>
            メールを送信する
          </PrimaryButton>
        </Box>
      </VStack>
      <ModalDialog
        title="メールを送信しました"
        isOpen={isOpen}
        onClose={handleCloseConfirmDialog}
        secondaryAction={{
          text: '閉じる',
          onClick: handleCloseConfirmDialog,
        }}
      >
        送信されたメールのリンクより再設定をお願いします
      </ModalDialog>
    </>
  );
};

export default PasswordResetPage;
