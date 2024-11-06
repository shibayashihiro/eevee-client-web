import React, { FC } from 'react';
import { Box, Center, Text, VStack } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';

export const CartTopBanner: FC = () => {
  return (
    <>
      <Center h="128px" bg="brand.primary">
        <VStack>
          <Box py="5px" px="20px" bg="white" borderRadius="16px" className="bold-medium" color="brand.primary">
            {'カート'}
          </Box>

          <Box>
            <Text className="bold-small" whiteSpace="pre-line" textAlign="center" color={variables.monoWhite}>
              まだ注文は確定されておりません
            </Text>
          </Box>
        </VStack>
      </Center>
    </>
  );
};
