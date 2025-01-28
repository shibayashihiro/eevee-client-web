import React, { FC } from 'react';
import { Box, Flex, Text, Link, Icon } from '@chakra-ui/react';

import { RightArrowIcon } from '@/components/ui/Icons/RightArrowIcon';
import { ChevronLeftIcon } from '@/components/ui/Icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/Icons/ChevronRightIcon';

type FooterNavigationProps = {
  leftText: string; // Text for the left navigation
  rightText: string; // Text for the right navigation
  onLeftClick?: () => void; // Handler for left navigation click
  onRightClick?: () => void; // Handler for right navigation click
};

const FooterNavigation: FC<FooterNavigationProps> = ({
  leftText,
  rightText,
  onLeftClick,
  onRightClick,
}) => {
  return (

      <Flex justify="space-between" align="stretch" gap="12px">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          cursor="pointer"
          onClick={onLeftClick}
          w="full"
          borderBottom="2px solid"
          borderColor="brand.primary"
          px="16px"
          py="12px"
          gap="4px"
        >
          <ChevronLeftIcon boxSize="6" color="brand.primary" />
          <Text className='bold-small' fontWeight="bold" color="brand.primary">
            「{leftText}」をみる
          </Text>
        </Box>
        <Box
          display="flex"
          alignItems="start"
          justifyContent="flex-end"
          cursor="pointer"
          onClick={onRightClick}
          w="full"
          borderBottom="2px solid"
          borderColor="brand.primary"
          px="16px"
          py="12px"
          gap="4px"
        >
          <Text className='bold-small' fontWeight="bold" color="brand.primary">
            「{rightText}」をみる
          </Text>
          <ChevronRightIcon boxSize="6" color="brand.primary" />
        </Box>
      </Flex>

  );
};

export default FooterNavigation;
