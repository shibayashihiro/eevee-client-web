import { FC } from 'react';

import { ModalButtonAction, ModalDialog } from '@/components/ui/ModalDialog';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuth } from '@/auth/provider/AuthProvider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// NOTE: Component名の割にFatなのでより良い実装を思いついたらリファクタしたい
export const LogoutDialog: FC<Props> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const setLoading = useGlobalLoadingSpinnerDispatch();

  const dialogPrimaryAction: ModalButtonAction = {
    text: 'OK',
    onClick: async () => {
      setLoading(true);
      await signOut();
      onClose();
    },
  };

  const dialogSecondaryAction: ModalButtonAction = {
    text: 'キャンセル',
    onClick: onClose,
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="ログアウト"
      primaryAction={dialogPrimaryAction}
      secondaryAction={dialogSecondaryAction}
    >
      ログアウトしてもよろしいですか？
    </ModalDialog>
  );
};
