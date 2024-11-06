import { HStack } from '@chakra-ui/react';

import { SecondaryButton } from '@/components/ui/Button';

type Props = {
  // TODO: コースメニューの編集がAPIと接続すると動かないので、非表示の機構にしている。治ったらはoptionalではなくなる
  onClickEdit?: () => void;
  onClickDelete: () => void;
};

export const CartOrderItemActions = ({ onClickEdit, onClickDelete }: Props) => {
  return (
    <HStack mt="8px" alignItems="center" justifyContent="end" spacing="12px" fontSize="12px">
      {onClickEdit && <ActionButton onClick={onClickEdit}>内容を変更する</ActionButton>}
      <ActionButton onClick={onClickDelete}>削除する</ActionButton>
    </HStack>
  );
};

const ActionButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <SecondaryButton fontSize="12px" p="5.5px 16px" w="auto" h="28px" lineHeight="16.8px" onClick={onClick}>
      {children}
    </SecondaryButton>
  );
};
