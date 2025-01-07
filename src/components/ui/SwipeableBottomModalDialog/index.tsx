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
  import { useState, useRef, ComponentProps } from 'react';
  import { useSwipeable } from 'react-swipeable';
  
  import variables from '@/styles/variables.module.scss';
  
  import { CloseIcon } from '../Icons/CloseIcon';
  
  type Props = {
    title: string;
    footer: React.ReactNode;
  } & ComponentProps<typeof Modal>;
  
  export const SwipeableBottomModal = ({ title, children, footer, ...props }: Props) => {
    const [offsetY, setOffsetY] = useState(0); 
    const [isDragging, setIsDragging] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
  
    const handlers = useSwipeable({
      onSwiping: (eventData) => {
        if (eventData.dir === 'Down') {
          setIsDragging(true);
          const newOffsetY = Math.max(0, eventData.deltaY); 
          setOffsetY(newOffsetY);
        }
      },
      onSwiped: (eventData) => {
        setIsDragging(false);
        const containerHeight = modalRef.current?.offsetHeight || 0;
        const threshold = containerHeight * 0.3; 
  
        if (eventData.deltaY > threshold) {
          props.onClose?.(); 
          setOffsetY(0);
        } else {
          setOffsetY(0); 
        }
      },
      preventScrollOnSwipe: true,
      trackTouch: true,
    });
  
    return (
      <Modal {...props} size="full" scrollBehavior="inside" isCentered>
        <ModalOverlay bg="rgba(51,51,51,0.77)" />
        <ModalContent
          maxW={variables.containerMaxWidth}
          borderRadius="8px 8px 0 0"
          overflow="hidden"
          position="absolute"
          top={`${32 + offsetY}px`}
          pb="32px"
          transition={isDragging ? 'none' : 'top 0.3s ease'}
          {...handlers}
        >
          <ModalHeader
            display="flex"
            alignItems="center"
            px="20px"
            py="0"
            minH="65px"
            borderBottom="1px solid"
            borderBottomColor="mono.divider"
          >
            <Header title={title} onClose={props.onClose} />
          </ModalHeader>
          <ModalBody p="0" bg="mono.backGroundLight" overflowY="auto">
            {children}
          </ModalBody>
          {footer && (
            <ModalFooter
              pt="24px"
              px="20px"
              pb="32px"
              boxShadow="0px -0.5px 0px 0px #DDD"
              position="sticky"
              bottom="0"
              borderTop="1px solid"
              borderTopColor="mono.divider"
            >
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
  