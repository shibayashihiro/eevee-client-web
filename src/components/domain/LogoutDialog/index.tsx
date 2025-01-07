import { FC } from 'react';

import { ModalButtonAction, ModalDialog } from '@/components/ui/ModalDialog';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuth } from '@/auth/provider/AuthProvider';
import { useResolvedHomePath, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogoutDialog: FC<Props> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const router = useTenantRouter();
  const homePath = useResolvedHomePath();

  const dialogPrimaryAction: ModalButtonAction = {
    text: 'OK',
    onClick: async () => {
      setLoading(true);
      await signOut();
      router.replace(homePath);
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
