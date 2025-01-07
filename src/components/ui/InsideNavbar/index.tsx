import { VStack, HStack, Icon, Text, Spacer, Button, IconButton } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { containerMarginX } from '@/utils/constants';

import { ChevronLeftIcon } from '../Icons/ChevronLeftIcon';

type Props = {
  title: string;
  hideBackIcon?: boolean;
  onClickBackIcon?: () => void;
  trailing?: TrailingAction;
};

export type TrailingAction = {
  text: string;
  onClick: () => void | Promise<void>;
};

export const InsideNavbar = ({ title, hideBackIcon, onClickBackIcon, trailing }: Props) => {
  const hideBack = hideBackIcon || (!onClickBackIcon && window.history.length < 2);
  return (
    <VStack
      as="nav"
      h="65px"
      minH="65px"
      justifyContent="center"
      px={containerMarginX}
      align="left"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      borderBottomColor="mono.divider"
    >
      <HStack spacing="10px">
        {!hideBack && <BackIconButton onClickBackIcon={onClickBackIcon} />}
        <Text className="bold-large" lineHeight={1.3}>
          {title}
        </Text>
        {trailing && (
          <>
            <Spacer />
            <Button variant="link" onClick={trailing.onClick} textStyle="bold-small" textColor="mono.secondary">
              {trailing.text}
            </Button>
          </>
        )}
      </HStack>
    </VStack>
  );
};

const BackIconButton = ({ onClickBackIcon }: { onClickBackIcon?: () => void }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (onClickBackIcon) {
      onClickBackIcon();
    } else {
      router.back();
    }
  }, [onClickBackIcon, router]);

  return (
    <IconButton
      aria-label="戻る"
      variant="ghost"
      icon={<Icon as={ChevronLeftIcon} boxSize="24px" />}
      onClick={handleClick}
      _hover={{ bgColor: 'inherit' }}
      _active={{ bgColor: 'inherit' }}
    />
  );
};
