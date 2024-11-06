import { Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type Props = {
  number: number;
  bgColor: ComponentProps<typeof Box>['bg'];
  textColor: ComponentProps<typeof Box>['color'];
};

export const CircleNumber = ({ number, bgColor, textColor }: Props) => {
  return (
    <Box
      className="bold-small"
      boxSize="20px"
      bg={bgColor}
      color={textColor}
      textAlign="center"
      justifyContent="center"
      borderRadius="full"
      flexShrink={0}
    >
      {number}
    </Box>
  );
};
