import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, SimpleGrid } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, children }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent m="auto 10px 52px" borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight={700} pt="32px" px="20px" pb="0px">
          {title}
        </ModalHeader>
        <ModalBody p="16px 20px">{children}</ModalBody>
        <ModalFooter pt="0px" pb="24px" justifyContent="center">
          <SimpleGrid w="full" columns={2} spacing="11px">
            <SecondaryButton onClick={onClose}>キャンセル</SecondaryButton>
            <PrimaryButton onClick={onConfirm}>OK</PrimaryButton>
          </SimpleGrid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
