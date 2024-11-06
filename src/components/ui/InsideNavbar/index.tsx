import { VStack, HStack, Icon, Text, Spacer, Button } from '@chakra-ui/react';
import { FC } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { containerMarginX } from '@/utils/constants';

type Props = {
  title: string;
  onClickBackIcon: () => void;
  trailing?: TrailingAction;
};

export type TrailingAction = {
  text: string;
  onClick: () => void | Promise<void>;
};

export const InsideNavbar: FC<Props> = ({ title, onClickBackIcon, trailing }) => {
  return (
    <>
      <VStack
        py="20px"
        px={containerMarginX}
        align="left"
        borderBottomStyle="solid"
        borderBottomWidth="1px"
        borderBottomColor="mono.divider"
      >
        <HStack spacing="10px">
          <Icon as={ChevronLeftIcon} boxSize="24px" _hover={{ cursor: 'pointer' }} onClick={onClickBackIcon} />
          <Text className="bold-large">{title}</Text>
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
    </>
  );
};
