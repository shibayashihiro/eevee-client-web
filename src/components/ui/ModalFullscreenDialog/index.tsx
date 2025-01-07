import {
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ComponentProps } from 'react';

import variables from '@/styles/variables.module.scss';

import { CloseIcon } from '../Icons/CloseIcon';

type Props = {
  title: string;
  footer: React.ReactNode;
} & ComponentProps<typeof Modal>;

export const ModalFullscreenDialog = ({ title, children, footer, ...props }: Props) => {
  return (
    <Modal {...props} size="full" scrollBehavior="inside">
      <ModalOverlay bg="rgba(51,51,51,0.77)" />
      <ModalContent maxW={variables.containerMaxWidth}>
        <ModalHeader
          display="flex"
          alignItems="center"
          px="20px"
          py="0"
          minH="60px"
          borderBottom="1px solid"
          borderBottomColor="mono.divider"
        >
          <Header title={title} onClose={props.onClose} />
        </ModalHeader>
        <ModalBody py="24px" px="20px">
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter pt="24px" px="20px" pb="32px" boxShadow="0px -0.5px 0px 0px #DDD">
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => {
  return (
    <HStack spacing="12px">
      <IconButton
        aria-label="ダイアログを閉じる"
        icon={<CloseIcon boxSize="24px" color="mono.primary" />}
        onClick={onClose}
        colorScheme="whiteAlpha"
      />
      <Text className="bold-large" lineHeight={1.3}>
        {title}
      </Text>
    </HStack>
  );
};
