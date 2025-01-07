import { FC, useCallback } from 'react';
import { Add, Remove } from '@mui/icons-material';
import { ButtonGroup, IconButton, Text, HStack } from '@chakra-ui/react';

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
      <ButtonGroup isAttached={false} variant="outline" colorScheme="brand">
        <IconButton
          aria-label="Decrement"
          icon={<Remove />}
          rounded="full"
          border="1px solid"
          onClick={decrement}
          disabled={min !== undefined && value <= min}
          _disabled={{
            color:"mono.divider",
            borderColor: 'mono.divider',
          }}
        />
        <Text minW="44px" color="brand.primaryText" fontSize="20px" fontWeight="600" textAlign="center" >
          {value}
        </Text>
        <IconButton
          aria-label="Increment"
          icon={<Add />}
          rounded="full"
          onClick={increment}
          disabled={max !== undefined && value >= max}
        />
      </ButtonGroup>
    </HStack>
  );
};
