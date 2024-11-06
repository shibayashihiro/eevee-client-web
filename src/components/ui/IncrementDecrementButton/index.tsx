import { FC, useCallback } from 'react';
import { Add, Remove } from '@mui/icons-material';
import { Center, ButtonGroup, IconButton, Text, HStack } from '@chakra-ui/react';

export type Props = {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
};

export const IncrementDecrementButton: FC<Props> = ({ value, onChange, min, max }) => {
  const increment = useCallback(() => {
    onChange(value + 1);
  }, [value, onChange]);

  const decrement = useCallback(() => {
    onChange(value - 1);
  }, [value, onChange]);

  return (
    <HStack alignItems="center">
      <ButtonGroup isAttached variant="outline" colorScheme="brand">
        <IconButton
          aria-label="Decrement"
          icon={<Remove />}
          rounded="22px"
          borderRightStyle="none"
          onClick={decrement}
          disabled={min !== undefined && value <= min}
        />
        <Center px="34px" borderWidth="1px" borderStyle="solid none" borderColor="brand.primary">
          <Text w="full" color="brand.primaryText" className="text-medium">
            {value}
          </Text>
        </Center>
        <IconButton
          aria-label="Increment"
          icon={<Add />}
          rounded="22px"
          borderLeftStyle="none"
          onClick={increment}
          disabled={max !== undefined && value >= max}
        />
      </ButtonGroup>
    </HStack>
  );
};
