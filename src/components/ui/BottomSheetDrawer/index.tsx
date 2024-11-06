import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { RefObject } from 'react';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: RefObject<HTMLElement>;
  onCloseComplete?: () => void;
};

export const useBottomSheet = () => useDisclosure();

/**
 * アプリでいうBottomSheetっぽいUIを提供するコンポーネント。
 * 完全なBottomSheetを作るには(スワイプで閉じるなど)自前実装が必要なので
 * Drawerで擬似的に再現する。
 */
export const BottomSheetDrawer = ({ children, isOpen, onClose, finalFocusRef, onCloseComplete }: Props) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      onCloseComplete={onCloseComplete}
    >
      <DrawerOverlay backgroundColor="rgba(0, 0, 0, 0.4)" />
      <DrawerContent borderTopRadius="12px">
        <DrawerHeader py="8px">
          <Center>
            <BottomSheetBar />
          </Center>
        </DrawerHeader>

        <DrawerBody pt="14px" pb="32px">
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const BottomSheetBar = () => <Box w="32px" h="4px" bgColor="mono.divider" borderRadius="4px" />;
