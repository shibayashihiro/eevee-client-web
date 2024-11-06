import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// 画面下部固定のフッター領域
export const FixedFooter = ({ children }: Props) => {
  return (
    <Box position="sticky" bottom={0} zIndex="sticky" borderTop="1px" borderTopColor="mono.divider" bg="mono.white">
      {children}
    </Box>
  );
};
