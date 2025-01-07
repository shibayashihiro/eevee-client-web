import React, { FC } from 'react';
import { UnorderedList, ListItem, Text, VStack, Box } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const AccountWithdrawalDialog: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ModalDialog title="退会の手続き" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <VStack spacing="24px" align="start">
        <Text className="text-small">
          退会するとログイン、同じ電話番号・メールアドレスで会員登録ができなくなります。
        </Text>
        <Text className="text-small">退会すると以下の情報は削除され、削除された情報は元に戻すことはできません</Text>
        <Box bg="mono.bg" p={4} w={'full'} borderRadius={'md'}>
          <UnorderedList className="text-small" spacing="4px">
            <ListItem>メールアドレス</ListItem>
            <ListItem>プロフィール</ListItem>
            <ListItem>クーポン</ListItem>
          </UnorderedList>
          <Text className="text-small">など</Text>
        </Box>
        <Text className="text-extra-small" color="mono.secondary">
          ※ご不明点がある場合はお問い合わせよりサポートチームまでお問い合わせください。
        </Text>
      </VStack>
      <VStack spacing="12px" mt="24px" w="full">
        <PrimaryButton onClick={onConfirm} w="full">
          退会する
        </PrimaryButton>
        <SecondaryButton onClick={onClose} w="full">
          このまま利用を継続する
        </SecondaryButton>
      </VStack>
    </ModalDialog>
  );
};
