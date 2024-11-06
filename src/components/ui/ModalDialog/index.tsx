import React, { FC, ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  HStack,
  Spacer,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '../Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  primaryAction?: ModalButtonAction;
  secondaryAction?: ModalButtonAction;
  linkAction?: ModalButtonAction;
  closeOnOverlayClick?: boolean;
  trapFocus?: boolean;
  scrollBehavior?: ScrollBehavior;
  children: ReactNode;
};

export type ModalButtonAction = {
  text: string;
  onClick: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
};

type ScrollBehavior = 'inside' | 'outside';

export const ModalDialog: FC<Props> = ({
  isOpen,
  onClose,
  title,
  primaryAction,
  secondaryAction,
  linkAction,
  closeOnOverlayClick,
  trapFocus,
  scrollBehavior,
  children,
}: Props) => {
  const size = useBreakpointValue({ base: 'md', md: 'lg' });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
      trapFocus={trapFocus}
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay bg="rgba(51,51,51,0.77)" />
      <ModalContent mt="auto" mb="12px" p="32px 20px 24px 20px">
        {title && (
          <ModalHeader mb="16px" p="0px">
            <Text className="bold-large">{title}</Text>
          </ModalHeader>
        )}

        <ModalBody p="0px" className="text-small">
          {children}
        </ModalBody>

        {primaryAction || secondaryAction || linkAction ? (
          <ModalFooter justifyContent="center" mt="16px" p="0px">
            <HStack spacing="11.5px" w="full">
              {secondaryAction && (
                <SecondaryButton
                  onClick={secondaryAction.onClick}
                  isLoading={secondaryAction?.isLoading}
                  isDisabled={secondaryAction?.disabled}
                >
                  {secondaryAction.text}
                </SecondaryButton>
              )}
              {primaryAction && (
                <PrimaryButton
                  onClick={primaryAction.onClick}
                  isLoading={primaryAction?.isLoading}
                  isDisabled={primaryAction?.disabled}
                >
                  {primaryAction.text}
                </PrimaryButton>
              )}
              {linkAction && (
                <Button
                  w="full"
                  variant="link"
                  onClick={linkAction.onClick}
                  textStyle="bold-small"
                  textColor="mono.secondary"
                  isLoading={linkAction.isLoading}
                  isDisabled={linkAction.disabled}
                >
                  {linkAction.text}
                </Button>
              )}
            </HStack>
          </ModalFooter>
        ) : (
          <Spacer mb="24px" />
        )}
      </ModalContent>
    </Modal>
  );
};
