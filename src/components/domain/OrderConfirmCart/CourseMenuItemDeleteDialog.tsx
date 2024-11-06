import React, { useCallback, useState } from 'react';
import { Text, useDisclosure } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useRemoveCartCourseMenuItemMutation } from './CourseMenuItemDeleteDialog.mutation.generated';

type Props = {
  cartId: string;
  item: SelectedItem | null;
  isOpen: boolean;
  onClose: () => void;
};

type SelectedItem = {
  cartItemId: string;
  courseMenuName: string;
  courseMenuEntryName: string;
};

export const useCourseMenuItemDeleteDialog = () => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (cartItemId: string, courseMenuName: string, courseMenuEntryName: string) => {
      setSelectedItem({
        cartItemId,
        courseMenuName,
        courseMenuEntryName,
      });
      onOpen();
    },
    [onOpen],
  );

  return {
    selectedItem,
    isOpen,
    onOpen: handleOpen,
    onClose,
  };
};

export const CourseMenuItemDeleteDialog = ({ cartId, item, isOpen, onClose }: Props) => {
  const [{ fetching }, removeCartCourseMenuItem] = useRemoveCartCourseMenuItemMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const handleSubmit = async () => {
    if (!item) {
      return;
    }
    const { error } = await removeCartCourseMenuItem({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        courseMenuItemId: item.cartItemId,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
    }
    onClose();
  };

  return (
    <>
      <ModalDialog
        title={'カートから削除'}
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{
          text: 'キャンセル',
          onClick: onClose,
          isLoading: fetching,
        }}
        primaryAction={{
          text: 'OK',
          onClick: handleSubmit,
          isLoading: fetching,
        }}
        closeOnOverlayClick={false}
      >
        {item && (
          <Text>{`${item.courseMenuName}(${item.courseMenuEntryName})`} をカートから削除してもよろしいですか？</Text>
        )}
      </ModalDialog>
    </>
  );
};
