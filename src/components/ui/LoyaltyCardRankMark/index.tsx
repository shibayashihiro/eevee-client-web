import { Box, Center } from '@chakra-ui/react';

type Props = {
  color: string;
  size?: Size;
};

type Size = 'md' | 'lg';

const sizes: Record<Size, string> = {
  md: '24px',
  lg: '32px',
} as const;

export const LoyaltyCardRankMark = ({ color, size = 'md' }: Props) => {
  return (
    <Center
      width={sizes[size]}
      height={sizes[size]}
      backgroundColor="white"
      border="4px solid"
      borderColor={color}
      borderRadius="50%"
    >
      <Box w="full" h="full" backgroundColor={color} opacity="0.8" borderRadius="50%" />
    </Center>
  );
};
